import React, {useState, useEffect} from 'react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './NavBar-Routes/NavBar';
import Routing from './NavBar-Routes/Routing';
import { UserContext } from './Auth/UserContext';
import RecipeApi from './Api/RecipeApi';
import useLocalStorage from './hooks/useLocalStorage';
import {jwtDecode} from 'jwt-decode';



const App = () => {

  
  const [token, setToken] = useLocalStorage('recipe-token', null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(function loadUserInfo() {
    
    async function getCurrentUser() {
      if(token) {
        try{
          let {username} = jwtDecode(token);

          RecipeApi.token = token;
          let currentUser = await RecipeApi.getCurrentUser(username);
          setCurrentUser(currentUser);
        }
        catch (error){
          console.error("App loadUserInfo: problem loading", error);
          setCurrentUser(null);
        }
      }
    }
    getCurrentUser();
  },[token]);
  


  async function signup(data) {
    try {
      const response = await RecipeApi.signup(data);

      const token = response.token;

      if(token) {
        setToken(token);
        RecipeApi.token = token;
        console.log("Sign-up successful, token set:", token);
        return {success: true, token };
      }
      
     
    } catch (error) {
      console.error("Sign up failed", error);
      return {success: false, error};
    }
  }

  async function login(data) {
    try {
        const response = await RecipeApi.login(data); // Call the API login

        const token = response.token; // Extract the token from the response

        if (token) {
            setToken(token); // Set the token in your state/context
            RecipeApi.token = token; // Store the token for future API requests
            console.log("Login successful, token set:", token); // Log the token
        } else {
            console.error("No token returned from API during login.");
        }

        return { login: true };
    } catch (error) {
        console.error("Login failed!", error);
        return { login: false };
    }
}



  async function logout() {
    setToken(null);
    setCurrentUser(null);
    RecipeApi.token = null;
  }

  return(
  <UserContext.Provider
  value={{currentUser, signup, login, logout}}>
    <BrowserRouter>
      <NavBar logout={logout}/>
      <Routing signup={signup} login={login}/>
    </BrowserRouter>
  </UserContext.Provider>
  )
}

export default App;
