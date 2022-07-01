//cookieParser variable
const cookieParser = require('cookie-parser')

// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");



// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

//Use cookieParser
app.use(cookieParser());

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
// const widgetsRoutes = require("./routes/widgets");
const apiRoutes = require("./routes/api")
const mapsRoutes = require("./routes/maps");
const locationsRoutes = require("./routes/locations");
const newMapsRoutes = require("./routes/newMaps");
const { getUser } = require("./user-helpers");


// Mount all resource routes
// Note: Feel free to replace the example routes below with your own


// app.use("/api/widgets", widgetsRoutes(db));
app.use('/api', apiRoutes(db));
app.use('/maps', mapsRoutes(db));
app.use('/newMaps', newMapsRoutes(db));
app.use('/locations', locationsRoutes(db));
app.use('/users', usersRoutes(db));


// app.use(commentsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

//Local Host 8080
app.get("/", (req, res) => {
  res.render('index', { userID: req.cookies.user_id });
});

//Login
app.get("/login/:user_id", (req, res) => {
  const userID = req.params.user_id
  res.cookie('user_id', req.params.user_id);
  res.redirect('/users')
})

//Logout
app.post("/logout", (req, res) => {
  res.clearCookie('user_id')
  res.redirect('/');
})
app.get("/logout", (req, res) => {
  res.clearCookie('user_id')
  res.redirect('/');
})

// // for markers
// app.get("/maps", (req,res) => {
//   res.render("/maps/1");
// })

app.post("/maps/:id", (req, res) => {
  console.log(req.body);
} )

//For future conditional mock route if we wanted to check if they are logged in and redirect accordingly
// app.get('/profile', (req, res) => {
// if (req.params.user_id) {
  // res.render('/profile')
// } else {
//   res.redirect('/')
// }
// }

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
