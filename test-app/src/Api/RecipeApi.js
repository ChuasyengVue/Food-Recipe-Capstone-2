import axios from 'axios';

const BASE_URL = "http://localhost:5000/api";

class RecipeApi {

    static token;

    static async request(endpoint, data = {}, method = "get") {
        console.debug("API Call:", endpoint, data, method);

        const url = `${BASE_URL}/${endpoint}`;
        const headers = {Authorization: `Bearer ${RecipeApi.token}`};
        console.debug("Authorization Header:", headers.Authorization);
        const params = (method === "get")
            ? data
            : {};

        try {
            return (await axios({ url, method, data, params, headers })).data;
            
        } catch (error) {
            console.error("API Error:", error.response);
            let message = error.response.data.error.message;
            throw Array.isArray(message) ? message: [message];
        }
    }

    // ***********************************************************************

    static async searchRecipes (query, excludeIngredients='') {
        const params ={
            query,
            excludeIngredients: excludeIngredients,
        };
        
       return await this.request(`recipes/complexSearch`, params);   
    }

    static async createRecipes (title, ingredients, instructions, readyInMinutes,
        servings, imageUrl, author) {
            
            const data ={
                title, 
                ingredients, 
                instructions, 
                readyInMinutes,
                servings, 
                imageUrl, 
                author
            }

            let res = await this.request(`recipes/createRecipe`, data, 'post');
            return res.recipe;
    }

    static async getUserRecipes() {
        const response = await this.request("recipes/myRecipe");
        return response.recipes; // Adjust based on your API response
    }

    static async summaryRecipes (id) {
        let res = await this.request(`recipes/${id}/summary`);
        return res;
    }

    static async login(data) {
        const res = await this.request("users/login", data, 'post');
        return res; 
    }
    
    static async signup(data) {
        const res = await this.request("users/signup", data, 'post');
        return res;
    }

    static async getCurrentUser(username) {
        let res = await this.request(`users/${username}`);
        return res.user;
      }

}


export default RecipeApi;


