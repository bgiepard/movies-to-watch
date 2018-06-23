import React, { Component } from 'react';

import searchIcon from './img/search_icon.svg';
import noPoster from './img/no_poster.png';


class MovieInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            movie: this.props.movie,
            similar: []
        }
    }

    fetchSimilar(url)  {
        fetch(url)
            .then(response => response.json())
            .then(data => {

            let sortedMovies = data.results.sort((a, b, index) => (b.vote_average - a.vote_average)) 

            let removeCurrent = sortedMovies.filter((movie) => (movie.title!==this.props.movie.title))

            let bestMovies = removeCurrent.filter((value, index) => index < 8 ) 


            return this.setState({
                similar: bestMovies
            })
        })
    }

    render() {    
        return (

            <div className="movie">
                <div className="movie__poster">
                    <img className="movie__poster__image" src={(this.props.movie.poster_path)?('https://image.tmdb.org/t/p/w300' + this.props.movie.poster_path) : noPoster} alt={this.props.movie.title} />
                </div>

                <div className="movie__info">
                    <h1 className="movie__info__title">{this.props.movie.title}  
                        <span className="movie__info__year">  ({this.props.movie.release_date.substring(0,4)})</span>
                    </h1>

                    {(this.props.movie.title !== this.props.movie.original_title)&&(<h2 className="movie__info__subtitle">{this.props.movie.original_title}</h2>)}

                    <ul className="movie__info__genres">
                        {this.props.movie.genres.map(genre => <li className="movie__info__genre-item" key={genre.id}> {genre.name} </li>)}
                    </ul>

                    <p className="movie__info__overview">{this.props.movie.overview}</p>

                    <ul className="movie-properties">
                        <li className="movie-properties__item">
                            <span className="movie-properties__item__label">Ocena: </span>
                            <span className="movie-properties__item__value">{this.props.movie.vote_average} / 10 </span>
                        </li>
                        <li className="movie-properties__item">
                            <span className="movie-properties__item__label">Czas trwania: </span>
                            <span className="movie-properties__item__value">{this.props.movie.runtime} min </span>
                        </li>
                    </ul>

                    <nav className="movie-navigation">
                        <button className="btn btn--back" onClick={this.props.backToSearch} >Wróć do wyników</button>
                        <button className="btn btn--add" onClick={() => this.props.add(this.props.movie)}>Dodaj do listy</button>
                    </nav>

                </div>


                {(this.state.similar.length>0)&&
                    <div className="similar-movies">
                        <h2 className="similar-movies__heading">Mogą Ci się spodobać</h2>
                        <ul className="similar-movies__list">
                            {this.state.similar.map((movie, index) => {
                                return <li className="similar-movie" 
                                           onClick={() => this.props.showMovie(movie.id)} 
                                           key={index}>

                                    <div className="similar-movie__poster">
                                        <img className="similar-movie__poster__image" src={'https://image.tmdb.org/t/p/w300' + movie.poster_path} 
                                            alt={movie.title}/>
                                    </div>
                                    <div className="similar-movie__icon-container">
                                        <img className="similar-movie__icon" src={searchIcon} alt="zoom icon"/>
                                    </div>
                                </li>
                            })}
                        </ul>

                    </div>}
            </div>
        )


    }

    componentDidUpdate(prevProps) {
        if (this.props.movie !== prevProps.movie) {
            let url = `https://api.themoviedb.org/3/movie/${this.props.movie.id}/recommendations?api_key=3471d3e05da1ebfbf6ee5b612343236a&language=pl`;
            this.fetchSimilar(url);

        }
    }

    componentDidMount() {
        let url = `https://api.themoviedb.org/3/movie/${this.props.movie.id}/recommendations?api_key=3471d3e05da1ebfbf6ee5b612343236a&language=pl`;
        this.fetchSimilar(url);        
    }
}

export default MovieInfo;