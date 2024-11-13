"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "recipe-secretKey";
const RENDER_API_KEY = process.env.RENDER_API_KEY;
const PORT = process.env.PORT || 5000;

// Use dev database, testing database, or via env var, prodcution database
function getDatabaseUri() {
    return process.env.NODE_ENV === 'production' 
           ? process.env.DATABASE_URL // Use DATABASE_URL from Render in production
           : process.env.LOCAL_DATABASE_URL || 'postgres://localhost/your_local_db'; // Local DB for development
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === 'test' ? 1 : 12;

console.log("Recipe Config:".green);
console.log("SECRET_KEY".yellow, SECRET_KEY);
console.log("RENDER_API_KEY".yellow, RENDER_API_KEY); 
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("NODE_ENV:".yellow, process.env.NODE_ENV)
console.log("---");

module.exports = {
    SECRET_KEY,
    RENDER_API_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
};