"use strict";
const db = require("../db");
const axios = require("axios");

const apiKey = process.env.SPOONACULAR_API_KEY;

const base_url ="https://api.spoonacular.com/recipes";

/** Related functions for recipes. */

class Recipe {


    static async searchRecipes(query, excludeIngredients, number
    ) {
        if(!apiKey){
            throw new Error("API key not found!");
        }

        const url = `${base_url}/complexSearch`;


        const params = {
            apiKey: apiKey,
            query: query,
            excludeIngredients: excludeIngredients,
            number: 10
        }
       

        try {
            const searchResponse = await axios.get(url, {params});
            return searchResponse.data.results;
        } catch (error) {
            console.log(error);
            throw new Error('Error fetching recipes from Spoonacular API');
        }
    }


    static async addRecipes(username, title, ingredients, instructions, readyInMinutes, servings, imageUrl, author) {
        const result = await db.query(
            `INSERT INTO recipes (user_id, title, ingredients, instructions, readyInMinutes,
            servings, image_url, author, createdAt, updatedAt)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING id, title, ingredients, instructions, readyInMinutes, servings, image_url AS "imageUrl", author, user_id AS "userId", createdAt, updatedAt`,
            [username, title, ingredients, instructions, readyInMinutes, servings, imageUrl, author]
        );
        return result.rows[0];
    }
    

    static async getRecipesByUser(userId) {
        const results = await db.query(
            `SELECT * 
             FROM recipes
             WHERE user_id = $1`,
             [userId]
        );
        return results.rows;
    }
    

    static async summarizeRecipes(id) {
        if(!apiKey){
            throw new Error("API key not found!");
        }

        const url = `${base_url}/${id}/summary`;

        const params = {
            apiKey:apiKey,
        }

        try {
            const summarizeResponse = await axios.get(url, {params});
            return summarizeResponse.data;
        } catch (error) {
            console.log(error);
        }
    }


}

module.exports = Recipe;