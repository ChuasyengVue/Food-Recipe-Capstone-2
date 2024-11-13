import React from "react";
import { Route, Routes } from 'react-router-dom'; 
import Homepage from "../Components/Homepage";
import Recipes from "../Components/Recipes";
import CreateRecipe from "../Components/CreateRecipe";
import MyRecipe from "../Components/MyRecipe";
import LoginForm from '../Auth/LoginForm';
import SignupForm from '../Auth/SignupForm';

const Routing = ({signup, login}) => {
    return(
        <Routes>
            <Route path="/" element={<Homepage />}/>
            <Route path="/api/recipes" element={<Recipes />} />
            <Route path="/api/createRecipe" element={<CreateRecipe />} />
            <Route path="/myRecipes" element={<MyRecipe />} />
            <Route path="/login" element={<LoginForm login={login}/>} />
            <Route path="/signup" element={<SignupForm signup={signup}/>} />
        </Routes>
    )
}

export default Routing;