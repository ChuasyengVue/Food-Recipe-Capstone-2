import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav } from 'reactstrap';
import { UserContext } from '../Auth/UserContext';
import './NavBar.css'; // Import your CSS file

const NavBar = ({ logout }) => {
    const { currentUser } = useContext(UserContext);

    function LoggedInNav() {
        return (
            <Nav className="logged-in-nav">
                <NavLink className="nav-item" to="/api/createRecipe">New Recipe</NavLink>
                <NavLink className="nav-item" to="/myRecipes">My Recipes</NavLink>
                <NavLink className="nav-item" to="/" onClick={logout}>Logout {currentUser && currentUser.username}</NavLink>
            </Nav>
        );
    }

    function LoggedOutNav() {
        return (
            <Nav className="logged-out-nav">
                <NavLink className="nav-item" to="/login">Login</NavLink>
                <NavLink className="nav-item" to="/signup">Sign Up</NavLink>
            </Nav>
        );
    }

    return (
        <Navbar className="navbar">
            <div className="navbar-container">
                <NavLink to="/" className="navbar-home">Home</NavLink>
                <NavLink to="/api/recipes" className="nav-item">Find Recipes</NavLink>
                <div className="user-nav">
                    {currentUser ? LoggedInNav() : LoggedOutNav()}
                </div>
            </div>
        </Navbar>
    );
}

export default NavBar;
