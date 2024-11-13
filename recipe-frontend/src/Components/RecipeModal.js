import React from "react";
import "./RecipeModal.css";

const RecipeModal = ({show, onClose, recipe}) => {
    if(!show || !recipe ){
        return null;
    }

    return(
        <>
            <div className="overlay"></div>
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>{recipe.result.title}</h2>
                        <span className="close-btn" onClick={onClose}>&times;</span>
                    </div>
                    <img src={recipe.image} alt={recipe.title}/>
                    
                    {/* Render HTML summary safely */}
                    <p dangerouslySetInnerHTML={{ __html: recipe.result.summary }} />
                </div>
            </div>
        </>
        
    )
}

export default RecipeModal;