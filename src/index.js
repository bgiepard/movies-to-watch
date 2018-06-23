import React from 'react';
import ReactDOM from 'react-dom';

import SearchBar from './SearchBar';
import MoviesList from './MoviesList';
import MovieInfo from './MovieInfo';
import ToWatch from './ToWatch';

import './css/App.css';
import './css/App-responsive.css';



class App extends React.Component {
    constructor() {
        super();

        this.state = {
            phrase: '',
            showSingleMovie: false,
            waitingList: []
        }

        // pages navigation
        this.startPage = this.startPage.bind(this);
        this.backToSearch = this.backToSearch.bind(this);

        this.changePhrase = this.changePhrase.bind(this);
        this.showMovie = this.showMovie.bind(this);

        // to-do-list
        this.addToList = this.addToList.bind(this);
        this.removeFromlist = this.removeFromlist.bind(this);
        this.alreadySeen = this.alreadySeen.bind(this);
    }


    changePhrase(e) {
        const patern = /[^A-Za-z0-9 ]+/ig;
        
        let result = patern.test(e.target.value);

        if(!result) {
            
            this.setState({
                phrase: e.target.value
            })
            
            
            // movies search
            if(e.target.value.length > 1) {
                this.setState({
                    showSingleMovie: false
                })

                let url = 'https://api.themoviedb.org/3/search/movie?api_key=3471d3e05da1ebfbf6ee5b612343236a&language=pl&query=' + this.state.phrase;
                this.fetchMovies(url);
            }
        }
    }
    
    fetchMovies(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {

            if(data.results) {
                // if movie list
                
                // filtering and sorting movies
                let sortedMovies = data.results.sort((a, b, index) => (b.popularity - a.popularity)) 
                let fetchedMovies = sortedMovies.filter((value, index) => index < 12 )
                

                return this.setState({
                    currentMovies: fetchedMovies
                })

            } else {
                // if single movie
                return this.setState({
                    movieDetails: data,
                    phrase: '',
                    showSingleMovie: true
                })
            }
        })
    }

    showMovie(e) {
        let url = 'https://api.themoviedb.org/3/movie/'+ e +'?api_key=3471d3e05da1ebfbf6ee5b612343236a&language=pl';
        this.fetchMovies(url);
    }

    // START PAGE - show popular movies
    startPage(){
        let url = 'https://api.themoviedb.org/3/discover/movie?api_key=3471d3e05da1ebfbf6ee5b612343236a&language=pl&sort_by=popularity.desc';

        this.fetchMovies(url);

        this.setState({
            showSingleMovie: false
        })
    }
    
    // previous page onClick
    backToSearch() {
        this.setState({
            showSingleMovie: false
        })
    }

    // to do list
    addToList(movie) {

        function alredyOnList(single) {
            return single.title === movie.title;
        }

        if( !this.state.waitingList.find(alredyOnList) ) {

            this.setState({
                waitingList: [...this.state.waitingList, {
                    title: movie.title,
                    year: movie.release_date.substring(0, 4),
                    duration: movie.runtime,
                    active: true
                }]
            }, () => { localStorage.setItem('movies', JSON.stringify(this.state.waitingList)) });

        }
    }
    removeFromlist(index) {
        let newList = this.state.waitingList;

        newList.splice(index,1);

        this.setState({
            waitingList: newList
        }, () => { localStorage.setItem('movies', JSON.stringify(this.state.waitingList)) })
    }
    alreadySeen(index) {    
        // prawdopodobnie złe rozwiązanie 
        // mutowanie listy w środku
        // do poprawy

        let newList = this.state.waitingList;
        
        let status = newList[index];
        status.active = !status.active;


        this.setState({
            waitingList: newList
        }, () => { localStorage.setItem('movies', JSON.stringify(this.state.waitingList)) })
    }


    render() {

        // background change
        let backdrop,
            appStyle;

        if(this.state.showSingleMovie) {
            backdrop = 'http://image.tmdb.org/t/p/w1280' + this.state.movieDetails.backdrop_path;

            appStyle = {
                backgroundImage: "url(" + backdrop + ")"
            }
        } else {
            appStyle = {
                background: "transparent"
            }
        }



        return (
            <div className="container" style={appStyle} >
                <div className="app">
                    <header className="app__header">
                        <div className="app__logo" onClick={this.startPage} >
                            <h2 className="app__title">MoviesToWatch</h2>
                            <span className="app__version">1.0</span>
                        </div>
                        <SearchBar phrase={this.state.phrase} changePhrase={this.changePhrase} />
                    </header>
                    <main className="main">
                        {(this.state.showSingleMovie) ? 
                            <MovieInfo 
                                add={this.addToList} 
                                movie={this.state.movieDetails} 
                                showMovie={this.showMovie} 
                                backToSearch={this.backToSearch}/> 
                            :

                            <MoviesList 
                                movies={this.state.currentMovies} 
                                showMovie={this.showMovie} /> 
                        }
                        <div className="todo-wrapper">
                            {(this.state.waitingList.length>0)&&
                                <ToWatch 
                                    seen={this.alreadySeen} 
                                    remove={this.removeFromlist} 
                                    list={this.state.waitingList} />}
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // async fetching movies on start
    componentDidMount() {
        let url = 'https://api.themoviedb.org/3/discover/movie?api_key=3471d3e05da1ebfbf6ee5b612343236a&language=pl&sort_by=popularity.desc';
        this.fetchMovies(url);

        
        // getting movies from local storage
        if(localStorage.getItem('movies')) {
            let storageList = JSON.parse(localStorage.getItem('movies'));

            this.setState({
                waitingList: storageList
            })
        }
    }
}

ReactDOM.render(<App />, document.getElementById('root'));