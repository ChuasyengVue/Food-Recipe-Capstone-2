"use strict";

/**Database setup for Recipe. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");
require("dotenv").config();

let db;

if(process.env.NODE_ENV === 'production') {
    db = new Client ({
        connectionString: 'postgresql://food_recipe_db_hwt7_user:e7PzDjmndbDhedpCajxJQQKzZEvav6WJ@dpg-csq50thu0jms73fngahg-a.oregon-postgres.render.com:5432/food_recipe_db_hwt7',
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    console.log("Using Local Database URI:", getDatabaseUri());
    db = new Client ({
        connectionString: getDatabaseUri()
    });
}

db.connect()
    .then(() => {
        console.log("Connected to the database");
    })
    .catch(err => {
        console.error("Error connecting to the database", err);
        process.exit(1); // Exit the process with an error code
    });

module.exports = db;