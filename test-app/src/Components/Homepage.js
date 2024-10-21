
import React, { useContext } from 'react';
import { UserContext } from '../Auth/UserContext';
import "./Homepage.css"

const Homepage = () => {
    const { currentUser } = useContext(UserContext);

    return (
        <div className='app-container'>
            <div className='header'>
                {/* Autoplay, loop, and muted attributes for the video */}
                <video src='/foodvideo.mp4' autoPlay loop muted></video>
                <div className='title'>
                    {currentUser ? (
                        <h2>Welcome back, {currentUser.username}!</h2>
                    ) : (
                        <h1>My Recipe App</h1>
                    )}
                    
                    <p>Discover and share your favorite recipes</p>
                </div>
            </div>
            <div className='welcome-message'>
                
            </div>
        </div>
    );
};

export default Homepage;
