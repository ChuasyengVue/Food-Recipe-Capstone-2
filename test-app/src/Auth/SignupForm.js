import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./AuthForm.css";

const Signup = ({signup}) => {

    const navigate = useNavigate();

    const[formData, setFormData] = useState({
        username:"",
        password:"",
        firstName:"",
        lastName:"",
        email:""
    });

    

    const handleChange = (evt) => {
        const {name, value} = evt.target;
        setFormData(prevFormData => ({
            ...prevFormData, [name]:value
        }));
    }

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        
        try {
          const result = await signup(formData); // Get the entire result object
          
          
          if (result.success) {
            const { token } = result; // Extract token from the result if signup was successful
            
            localStorage.setItem("token", token); // Store token in local storage
            navigate('/');  // Redirect to homepage
          } else {
            console.error("Sign up failed. No token received.");
          }
        } catch (error) {
          console.error("Sign up failed:", error);
        }
      };
      

    return(
        <div className="auth-container">
            
            <form onSubmit={handleSubmit} className="auth-form">
                <h3>Sign Up</h3>
                <div>
                    <label>Username</label>
                    <input
                    name="username"
                    type="text"
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

                <div>
                    <label>First Name</label>
                    <input
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div>
                    <label>Last Name</label>
                    <input
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div>
                    <label>Email</label>
                    <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    />
                </div>

                <button type="submit">Submit</button>

            </form>
        </div>
    )
}

export default Signup;