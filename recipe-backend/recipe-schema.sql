
CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL
        CHECK (position('@' IN email) > 1),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(username) ON DELETE CASCADE,
    title VARCHAR (200) NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    readyInMinutes INTEGER NOT NULL,
    servings INTEGER,
    image_url VARCHAR (500) NOT NULL,
    author VARCHAR (500) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
         
);