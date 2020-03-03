const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const mongojs = require("mongojs")
const compression = require("compression");
const path = require("path");

const PORT = process.env.PORT || 1234;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// connect to database
mongoose.connect("mongodb://localhost/PWA-BudgetTracker", {
    useNewUrlParser: true, 
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
});

// setting up mongo db
const databaseURL = process.env.MONGODB_URI || "PWA-BudgetTracker";
const collections = ["PWA-BudgetTracker"]

// reference to database
const db = mongojs(databaseURL, collections)

// if error with database, throw
db.on("error", error => {
  console.log(`DB error: ${error}`)
});

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on PORT ${PORT}!`);
});