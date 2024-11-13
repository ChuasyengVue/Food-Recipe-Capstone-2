"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Recipe = require("./recipe.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Recipe model", function () {
    const newRecipe = {
        username: "testuser",
        title: "Chicken Curry",
        ingredients: "chicken, curry powder",
        instructions: "Cook chicken with curry.",
        readyInMinutes: 30,
        servings: 4,
        imageUrl: "http://example.com/image.jpg",
        author: "Chef John",
    };

    beforeEach(async () => {
        // Clear the recipes table before each test
        await db.query("DELETE FROM recipes");
    });

    afterAll(async () => {
        // Cleanup: close database connection
        await db.end();
    });

    describe("addRecipes", function () {
        test("works", async function () {
            const recipe = await Recipe.addRecipes(
                newRecipe.username,
                newRecipe.title,
                newRecipe.ingredients,
                newRecipe.instructions,
                newRecipe.readyInMinutes,
                newRecipe.servings,
                newRecipe.imageUrl,
                newRecipe.author
            );

            expect(recipe).toEqual({
                id: expect.any(Number), // Assuming id is auto-incremented
                ...newRecipe,
                userId: newRecipe.username,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });

            const result = await db.query(
                `SELECT title, ingredients, instructions, readyInMinutes,
                        servings, image_url AS "imageUrl", author, user_id AS "userId"
                 FROM recipes
                 WHERE title = $1`,
                [newRecipe.title]
            );
            expect(result.rows).toEqual([{
                title: "Chicken Curry",
                ingredients: "chicken, curry powder",
                instructions: "Cook chicken with curry.",
                readyInMinutes: 30,
                servings: 4,
                imageUrl: "http://example.com/image.jpg",
                author: "Chef John",
                userId: newRecipe.username,
            }]);
        });

        test("bad request with duplicate title", async function () {
            // Create the first recipe
            await Recipe.addRecipes(
                newRecipe.username,
                newRecipe.title,
                newRecipe.ingredients,
                newRecipe.instructions,
                newRecipe.readyInMinutes,
                newRecipe.servings,
                newRecipe.imageUrl,
                newRecipe.author
            );

            try {
                // Attempt to create a recipe with the same title
                await Recipe.addRecipes(
                    newRecipe.username,
                    newRecipe.title,
                    newRecipe.ingredients,
                    newRecipe.instructions,
                    newRecipe.readyInMinutes,
                    newRecipe.servings,
                    newRecipe.imageUrl,
                    newRecipe.author
                );
                fail("Expected error not thrown");
            } catch (err) {
                expect(err instanceof BadRequestError).toBeTruthy();
            }
        });
    });

    describe("getRecipesByUser", function () {
        test("works", async function () {
            // Add a recipe to the database
            await Recipe.addRecipes(newRecipe.username, newRecipe.title, newRecipe.ingredients, newRecipe.instructions, newRecipe.readyInMinutes, newRecipe.servings, newRecipe.imageUrl, newRecipe.author);

            const recipes = await Recipe.getRecipesByUser(newRecipe.username);
            expect(recipes).toHaveLength(1);
            expect(recipes[0]).toEqual({
                id: expect.any(Number), // Assuming id is auto-incremented
                title: newRecipe.title,
                ingredients: newRecipe.ingredients,
                instructions: newRecipe.instructions,
                readyInMinutes: newRecipe.readyInMinutes,
                servings: newRecipe.servings,
                imageUrl: newRecipe.imageUrl,
                author: newRecipe.author,
                userId: newRecipe.username,
            });
        });
    });
});