"use strict";

/**Database setup for Recipe. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

if(process.env.NODE_ENV === 'production') {
    db = new Client ({
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    db = new Client ({
        connectionString: getDatabaseUri()
    });
}

db.connect();

module.exports = db;