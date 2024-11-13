import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MyRecipe from "./MyRecipe"; // Adjust the path as needed
import RecipeApi from "../Api/RecipeApi"; // Adjust the path as needed

jest.mock("../Api/RecipeApi"); // Mock the RecipeApi module

describe("MyRecipe Component", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear any previous mock calls
    });

    it("renders without crashing (smoke test)", () => {
        RecipeApi.getUserRecipes.mockResolvedValue([]); // Mock an empty response

        render(<MyRecipe />);

        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    it("displays recipes correctly when fetched", async () => {
        const mockRecipes = [
            {
                id: 1,
                title: "Pasta",
                instructions: "Boil water and add pasta.",
                readyInMinutes: 15,
                servings: 2,
                imageUrl: "http://example.com/pasta.jpg"
            },
            {
                id: 2,
                title: "Salad",
                instructions: "Mix vegetables.",
                readyInMinutes: 10,
                servings: 4,
                imageUrl: "http://example.com/salad.jpg"
            }
        ];

        RecipeApi.getUserRecipes.mockResolvedValue(mockRecipes); // Mock the resolved value

        render(<MyRecipe />);

        // Wait for the loading to finish
        await waitFor(() => {
            expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument(); // Ensure loading text is removed
        });

        // Verify that the recipes are displayed
        expect(screen.getByText(/Pasta/i)).toBeInTheDocument();
        expect(screen.getByText(/Mix vegetables/i)).toBeInTheDocument();
        expect(screen.getByText(/Ready in: 15 minutes/i)).toBeInTheDocument();
        expect(screen.getByText(/Servings: 2/i)).toBeInTheDocument();
        expect(screen.getByAltText(/Pasta/i)).toHaveAttribute("src", "http://example.com/pasta.jpg");
    });

    it("displays a message when there are no recipes", async () => {
        RecipeApi.getUserRecipes.mockResolvedValue([]); // Mock an empty response

        render(<MyRecipe />);

        await waitFor(() => {
            expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument(); // Ensure loading text is removed
        });

        expect(screen.getByText(/My Recipes/i)).toBeInTheDocument();
        expect(screen.queryByText(/Pasta/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Mix vegetables/i)).not.toBeInTheDocument();
    });

    it("matches snapshot", async () => {
        const mockRecipes = [
            {
                id: 1,
                title: "Pasta",
                instructions: "Boil water and add pasta.",
                readyInMinutes: 15,
                servings: 2,
                imageUrl: "http://example.com/pasta.jpg"
            }
        ];

        RecipeApi.getUserRecipes.mockResolvedValue(mockRecipes); // Mock the resolved value

        const { asFragment } = render(<MyRecipe />);

        // Wait for the loading to finish
        await waitFor(() => {
            expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument(); // Ensure loading text is removed
        });

        expect(asFragment()).toMatchSnapshot();
    });
});
