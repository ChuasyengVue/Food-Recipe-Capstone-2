import React, { useEffect, useState } from "react";
import RecipeApi from "../Api/RecipeApi";
import './MyRecipe.css';


const MyRecipe = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await RecipeApi.getUserRecipes(); 
                setRecipes(response); 
            } catch (error) {
                console.error("Error fetching recipes:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchRecipes();
    }, []);
    

    if(loading) return <p>Loading...</p>;

    return (
        <div className="my-recipe-container">
            <h1>My Recipes</h1>
            <div className="recipe-list">
                {Array.isArray(recipes) && recipes.map(recipe => (
                    <div className="recipe-card" key={recipe.id}>
                        <h2>{recipe.title}</h2>
                        <p>{recipe.instructions}</p>
                        <p>Ready in: {recipe.readyInMinutes || 0} minutes</p>
                        <p>Servings: {recipe.servings}</p>
                        {recipe.imageUrl && (
                            <img src={recipe.imageUrl} alt={recipe.title} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
    
};

export default MyRecipe;
