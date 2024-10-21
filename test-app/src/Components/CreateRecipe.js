import React, { useState } from "react";
import RecipeApi from "../Api/RecipeApi";
import './CreateRecipe.css';

const CreateRecipe = () => {

    const [newRecipe, setNewRecipe] = useState({
        title:"",
        ingredients: "", 
        instructions: "", 
        readyInMinutes: "",
        servings: "", 
        imageUrl: "", 
        author: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);    

    const handleChange = (evt) => {
        const {name, value} = evt.target;
        
        setNewRecipe(data => ({
            ...data, [name]: value
        }));
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setIsSubmitting(true);

        try {
            const {title, ingredients, instructions, readyInMinutes, servings, imageUrl, author} = newRecipe;
            const resp = await RecipeApi.createRecipes(title, ingredients, instructions, readyInMinutes, servings, imageUrl, author);
            console.log("Recipe created sucessfully:", resp);
            
            setNewRecipe({
                title: "",
                ingredients: "",
                instructions: "",
                readyInMinutes: "",
                servings: "",
                imageUrl: "",
                author: ""
            });

        } catch (error) {
            console.log("Error creating recipe:", error);
        }
        finally {
            setIsSubmitting(false);
        }
    }

    return(
        <div className="create-recipe-container">
            <form onSubmit={handleSubmit} className="create-recipe-form">
                <div>
                <label>
                    Title:<input type="text" name="title" placeholder="Recipe Title" value={newRecipe.title} onChange={handleChange} required/>
                </label>
                </div>

                <div>
                <label>
                    Ingredients:<input type="text" name="ingredients" placeholder="Recipe Ingredients" value={newRecipe.ingredients} onChange={handleChange} required/>
                </label>
                </div>

                <div>
                <label>
                    Instructions:<input type="text" name="instructions" placeholder="Recipe Instructions" value={newRecipe.instructions} onChange={handleChange} required/>
                </label>
                </div>

                <div>
                <label>
                    ReadyInMinutes:<input type="text" name="readyInMinutes" placeholder="Recipe CookTime" value={newRecipe.readyInMinutes} onChange={handleChange} required/>
                </label>
                </div>

                <div>
                <label>
                    Servings:<input type="integer" name="servings" placeholder="Serving Amount" value={newRecipe.servings} onChange={handleChange} required/>
                </label>
                </div>

                <div>
                <label>
                    Image Url:<input type="text" name="imageUrl" placeholder="Recipe Image" value={newRecipe.imageUrl} onChange={handleChange} required/>
                </label>
                </div>

                <div>
                <label>
                    Author:<input type="text" name="author" placeholder="Recipe Creator" value={newRecipe.author} onChange={handleChange} required/>
                </label>
                </div>
                
                <button type="submit" disabled={isSubmitting}>Submit</button>
            </form>
        </div>
    )
}

export default CreateRecipe;