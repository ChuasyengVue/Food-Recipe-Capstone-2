import React, {useContext} from 'react';
import { Route, Navigate } from 'react-router-dom';
import { UserContext } from '../Auth/UserContext';



const ProtectedRoute = ({children}) => {
    const { currentUser } = useContext(UserContext);
    return currentUser ? children : <Navigate to='/login' />
}

export default ProtectedRoute;