"use strict";

const request = require("supertest");
const app = require("../app"); // Adjust the path as necessary
const db = require("../db");
const Recipe = require("../models/recipe");
const User = require("../models/user");

const testUser = {
    username: "testuser",
    password: "password123",
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
};

const testRecipe = {
    title: "Test Recipe",
    ingredients: "Test Ingredients",
    instructions: "Test Instructions",
    readyInMinutes: 30,
    servings: 2,
    imageUrl: "http://test.img",
    author: "Test Author",
};

beforeAll(async () => {
    // Register a test user
    await User.register(testUser);
});

beforeEach(async () => {
    // Clear the recipes table before each test
    await db.query("DELETE FROM recipes");
});

afterAll(async () => {
    // Cleanup: close database connection
    await db.end();
});

describe("Recipe Routes", function () {
    let token;

    beforeEach(async () => {
        // Authenticate the user to get a token
        const response = await request(app)
            .post("/auth/token")
            .send({
                username: testUser.username,
                password: testUser.password,
            });
        token = response.body.token;
    });

    describe("GET /recipes/complexSearch", function () {
        test("works", async function () {
            const response = await request(app)
                .get("/recipes/complexSearch")
                .query({ query: "Test", excludeIngredients: "None" });
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("recipes");
        });

        test("error on invalid request", async function () {
            const response = await request(app)
                .get("/recipes/complexSearch")
                .query({}); // No query parameters
            expect(response.statusCode).toBe(200); // Adjust based on your error handling
            // Expect specific error handling if implemented
        });
    });

    describe("POST /recipes/createRecipe", function () {
        test("works", async function () {
            const response = await request(app)
                .post("/recipes/createRecipe")
                .set("Authorization", `Bearer ${token}`)
                .send(testRecipe);
            expect(response.statusCode).toBe(200);
            expect(response.body.recipe).toHaveProperty("title", testRecipe.title);
        });

        test("unauthorized without token", async function () {
            const response = await request(app)
                .post("/recipes/createRecipe")
                .send(testRecipe);
            expect(response.statusCode).toBe(401); // Unauthorized
        });

        test("error on missing fields", async function () {
            const response = await request(app)
                .post("/recipes/createRecipe")
                .set("Authorization", `Bearer ${token}`)
                .send({}); // Sending empty body
            expect(response.statusCode).toBe(400); // Adjust based on your error handling
        });
    });

    describe("GET /recipes/myRecipe", function () {
        test("works", async function () {
            await request(app)
                .post("/recipes/createRecipe")
                .set("Authorization", `Bearer ${token}`)
                .send(testRecipe);

            const response = await request(app)
                .get("/recipes/myRecipe")
                .set("Authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
            expect(response.body.recipes).toHaveLength(1);
            expect(response.body.recipes[0]).toHaveProperty("title", testRecipe.title);
        });

        test("unauthorized without token", async function () {
            const response = await request(app)
                .get("/recipes/myRecipe");
            expect(response.statusCode).toBe(401); // Unauthorized
        });
    });

    describe("GET /recipes/:id/summary", function () {
        test("works", async function () {
            const recipeResponse = await request(app)
                .post("/recipes/createRecipe")
                .set("Authorization", `Bearer ${token}`)
                .send(testRecipe);
            const recipeId = recipeResponse.body.recipe.id;

            const response = await request(app)
                .get(`/recipes/${recipeId}/summary`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("result");
        });

        test("error on invalid recipe id", async function () {
            const response = await request(app)
                .get(`/recipes/99999/summary`); // Assuming this ID doesn't exist
            expect(response.statusCode).toBe(404); // Adjust based on your error handling
        });
    });
});
