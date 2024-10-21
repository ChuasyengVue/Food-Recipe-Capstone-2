import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";


const LoginForm = ({login}) => {
    
    const navigate = useNavigate();

    const[formData, setFormData] = useState({
        username:"",
        password:""
    });

    const handleChange = (evt) =>{
        const {name, value} = evt.target;
        setFormData((prev) => ({...prev, [name]:value }));
    }

    const handleSubmit = async (evt) =>{
        evt.preventDefault();
        try {
            const resp = await login(formData);
            if(resp.login){
                navigate('/');
            }
            else{
                console.error("Login Failed!");
            }
            
        } catch (error) {
            console.error("Login failed:", error);
        }
    }

    return(
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h3>Log In</h3>
                <div>
                    <label>Username</label>
                    <input 
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    />
                </div>

                <button type='submit'> Submit </button>
            </form>
        </div>
    )

}

export default LoginForm;