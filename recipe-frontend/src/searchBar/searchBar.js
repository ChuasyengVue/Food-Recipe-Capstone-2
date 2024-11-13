import React, { useState } from 'react';
import './searchBar.css';

const SearchBar = ({ onSearch }) => {

    const [search, setSearch] = useState("");
    const [excludeIngredients, setExcludeIngredients] = useState("");

    const handleChange = (evt) => {
        setSearch(evt.target.value);
    }

    const handleExcludeChange = (evt) => {
        setExcludeIngredients(evt.target.value);
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        onSearch(search, excludeIngredients);
        console.log("Excluded:" ,excludeIngredients)
        setSearch("");
        setExcludeIngredients("");
    }

    return(
        <div className='search-bar-container'>
            <form onSubmit={handleSubmit} className='search-from'>
                <input
                type='text'
                name='search'
                placeholder='Enter a recipe..'
                value={search}
                onChange={handleChange}
                required>
                </input>

                <input 
                type='text'
                name='exclude'
                placeholder='Exclude Ingredients..'
                value={excludeIngredients}
                onChange={handleExcludeChange}/>

                <button type='submit' className='search-button'>Submit</button>
            </form>
        </div>
    )
}

export default SearchBar;