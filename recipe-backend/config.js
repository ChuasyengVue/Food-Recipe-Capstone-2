"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "recipe-secretKey";

const PORT = +process.env.PORT || 5000;

// Use dev database, testing database, or via env var, prodcution database
function getDatabaseUri() {
    return(process.env.NODE_ENV === 'test')
    ? "foodrecipe_test"
    : process.env.DATABASE_URL || "postgresql://localhost/foodrecipe";
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === 'test' ? 1 : 12;

console.log("Recipe Config:".green);
console.log("SECRET_KEY".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
};