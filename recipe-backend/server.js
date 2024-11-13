"use strict";

const app = require("./app");
const { PORT } = require("./config");
require("dotenv").config();

app.listen(PORT, function () {
    console.log(`Server running on port: ${PORT}`);
});