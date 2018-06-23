import React from 'react';
import noPoster from './img/no_poster.png';

const MoviesList = (props) => {
    if((props.movies)&&(props.movies.length>0)) {
        
        return (
            <ul className="movies-list">
                {props.movies.map(movie => 
                  <li className="movies-list__item" 
                      onClick={() => props.showMovie(movie.id)} 
                      key={movie.id}>

                      <div className="movies-list__item__poster">
                          <img 
                              className="movies-list__item__poster__image" 
                              src={(movie.poster_path)?('https://image.tmdb.org/t/p/w185/' + movie.poster_path) : noPoster} 
                              alt={movie.title}/>
                      </div>

                      <div className="movies-list__info">
                          <span className="movies-list__info__title">
                              {(movie.title.length>16)? movie.title.substring(0,16) +'...' : movie.title}
                          </span> 

                          <span className="movies-list__info__year"> ({movie.release_date.substring(0,4)})</span>
                      </div>

                  </li> )}
            </ul>
        )
    } else {
        return (
            <span>Brak szukanego filmu</span>
        )
    }
}

export default MoviesList;