const express = require("express");

const { BadRequestError } = require("../expressError");

const router = new express.Router();

const Recipe = require("../models/recipe");

const { ensureLoggedIn } = require("../middleware/auth");



router.get("/complexSearch", async function (req, res, next) {
    try {
        const {query, excludeIngredients } = req.query;
        console.log("Query:", query);
        console.log("excludeIngredients:", excludeIngredients);
        const results = await Recipe.searchRecipes(query,excludeIngredients);
        return res.json({recipes: results});
    } catch (error) {
        console.log('Error searching recipe:', error);
    }
    
});

router.post("/createRecipe", ensureLoggedIn, async function (req, res, next) {
    console.log("Received createRecipe request with body:", req.body);
    console.log("User:", res.locals.user);
    try {
      const { title, ingredients, instructions, readyInMinutes, servings, imageUrl, author } = req.body;
      const username = res.locals.user.username; // Get the authenticated user's username
  
      const recipe = await Recipe.addRecipes(username, title, ingredients, instructions, readyInMinutes, servings, imageUrl, author);
  
      return res.json({ recipe });
    } catch (error) {
      console.log("Error adding recipe:", error);
      return next(error);
    }
  });
  

router.get("/myRecipe", ensureLoggedIn, async function (req, res) {
    try {
        const username = res.locals.user.username;
        const results = await Recipe.getRecipesByUser(username); 
        return res.json({recipes: results});
    } catch (error) {
        console.log('Error fetching all recipes:', error);
    }
});


router.get("/:id/summary", async function (req, res) {
    try {
        const {id} = req.params;
        const result = await Recipe.summarizeRecipes(id);

        return res.json({result});
    } catch (error) {
        console.log('Error summarize recipes:', error);
    }
});


module.exports = router;