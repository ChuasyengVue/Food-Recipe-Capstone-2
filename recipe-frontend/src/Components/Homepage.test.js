import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserContext } from '../Auth/UserContext'; // Adjust the path as needed
import Homepage from './Homepage'; // Adjust the path as needed

describe('Homepage Component', () => {
    const mockUser = { username: 'testUser' };

    it('renders without crashing (smoke test)', () => {
        render(
            <UserContext.Provider value={{ currentUser: null }}>
                <Homepage />
            </UserContext.Provider>
        );

        // Check if key elements are rendered when user is not logged in
        expect(screen.getByText(/My Recipe App/i)).toBeInTheDocument();
        expect(screen.getByText(/Discover and share your favorite recipes/i)).toBeInTheDocument();
    });

    it('renders welcome message for logged-in user', () => {
        render(
            <UserContext.Provider value={{ currentUser: mockUser }}>
                <Homepage />
            </UserContext.Provider>
        );

        // Check if key elements are rendered when user is logged in
        expect(screen.getByText(/Welcome back, testUser!/i)).toBeInTheDocument();
        expect(screen.queryByText(/My Recipe App/i)).not.toBeInTheDocument(); // Ensure the title for not logged in users is not there
    });

    it('matches snapshot when user is logged out', () => {
        const { asFragment } = render(
            <UserContext.Provider value={{ currentUser: null }}>
                <Homepage />
            </UserContext.Provider>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('matches snapshot when user is logged in', () => {
        const { asFragment } = render(
            <UserContext.Provider value={{ currentUser: mockUser }}>
                <Homepage />
            </UserContext.Provider>
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
