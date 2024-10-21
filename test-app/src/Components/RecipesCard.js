import React from "react";
import './RecipesCard.css'

const RecipesCard = ({ recipe, onClick }) => {

    return (
        <div className="recipe-card" onClick={onClick}>
            <img src={recipe.image} alt={recipe.title} />
            <div className="recipe-card-title">
                <h3>{recipe.title}</h3>
            </div>
        </div>
    );
};

export default RecipesCard;
