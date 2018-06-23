import React, { Component } from 'react';

class ToWatch extends Component {
    render () {
    
        // sum of movies runtime
        let time = 0;
        this.props.list.map(movie => (movie.active) ? (time += movie.duration * 1) : null);
        let hours = Math.floor(time / 60) + 'h ' + (time % 60) + 'min';

        // styling watched movies on list
        const appStyle = {
            textDecoration: 'line-through',
            opacity: '0.5'
        };

        return (
            <div className="to-watch"> 
                <h3 className="to-watch__heading">Lista Twoich filmów</h3>
                <ul className="to-watch__list">
                    {this.props.list.map((item, index) => 
                         <li className="to-watch__movie" key={index}>
                             <span style={(!item.active) ? appStyle : null }>
                                 <span className="to-watch__movie__title">
                                     {(item.title.length>17)? item.title.substring(0,15) +'...' : item.title}
                                 </span>
                                 <span className="to-watch__movie__year">
                                     ({item.year}) 
                                 </span>
                             </span>

                             <span className="to-watch__btn-wrapper">
                                 <button className="to-watch__icon to-watch__icon--seen" onClick={() => this.props.seen(index)}></button>
                                 <button className="to-watch__icon to-watch__icon--del" onClick={() => this.props.remove(index)}></button>
                             </span>
                         </li>)}
                </ul>
                <span className="to-watch__runtime">Łączny czas: 
                <span className="to-watch__runtime__counter">{hours}</span></span>    
            </div>
        )
    }
}

export default ToWatch;