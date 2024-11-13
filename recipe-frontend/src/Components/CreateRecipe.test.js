import React from 'react';
import { render, screen } from '@testing-library/react';
import CreateRecipe from './CreateRecipe'; // Adjust the path as needed

describe('CreateRecipe Component', () => {
    it('renders without crashing (smoke test)', () => {
        render(<CreateRecipe />);
        
        // Check if key elements are rendered
        expect(screen.getByPlaceholderText(/Recipe Title/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Recipe Ingredients/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Recipe Instructions/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Recipe CookTime/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Serving Amount/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Recipe Image/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Recipe Creator/i)).toBeInTheDocument();
        expect(screen.getByText(/Submit/i)).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<CreateRecipe />);
        expect(asFragment()).toMatchSnapshot();
    });
});
