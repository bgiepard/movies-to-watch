import React from 'react';

const SearchBar = (props) => {
    return (
        <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <input 
                className="search-form__input" 
                type="text" 
                onChange={props.changePhrase} 
                value={props.phrase} 
                placeholder="szukaj filmu.."
                />
        </form>    
    )
}

export default SearchBar;