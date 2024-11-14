"use strict";

const express = require("express");
const cors = require("cors");
require('dotenv').config();

const { NotFoundError } = require("./expressError");

const recipeRoutes = require("./routes/recipe-routes");
const userRoutes = require('./routes/users');


const morgan = require("morgan");


const app = express();

const allowedOrigins = ["https://food-recipe-frontend-capstone-2.onrender.com"];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan("tiny"));


app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);



/** Handle 404 errors */
app.use(function (req, res, next) {
    return next( new NotFoundError());
});


module.exports = app;