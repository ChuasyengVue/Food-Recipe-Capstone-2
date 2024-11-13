import React, { useState } from "react";
import SearchBar from "../searchBar/searchBar";
import RecipeApi from "../Api/RecipeApi";
import RecipesCard from './RecipesCard';
import RecipeModal from "./RecipeModal";
import './Recipes.css';


const Recipes = () => {
    
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleSearch = async (query, excludeIngredients) => {
        try {
            const recipes = await RecipeApi.searchRecipes(query, excludeIngredients);
            setRecipes(recipes.recipes);
        } catch (error) {
            console.log(error);
            setRecipes([]);
        }
    }

    const handleOpenModal = async (recipe) => {
        try {
            const fullRecipeSummary = await RecipeApi.summaryRecipes(recipe.id);
            const summaryWithImage = {...fullRecipeSummary, image: recipe.image}
    
            setSelectedRecipe(summaryWithImage);
            setShowModal(true);
        } catch (error) {
            console.log("Error fetching recipe details:", error);
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRecipe(null);
    }

    return(
        <div className="recipes-container" >
            <SearchBar onSearch={handleSearch} />
            <div className="recipes-grid">
                {recipes.map(recipe => (
                    <div key={recipe.id} > 
                    <RecipesCard  recipe={recipe} onClick={() => handleOpenModal(recipe)} />
                    </div>
                ))}

                {selectedRecipe && (
                    <RecipeModal show={showModal} onClose={handleCloseModal} recipe={selectedRecipe} /> 
                )}
            </div>
            
        </div>
    )
}

export default Recipes;