/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const cookieParser = require('cookie-parser')

const { users } = require('../constants');
const { getUserById } = require('../helpers');

const selectAllUsers = db => {
  const query = 'SELECT * FROM users;'
  return db.query(query)
  .then((result) => {
    return result.rows;
  })
}

module.exports = (db) => {

  // user login.
  router.get('/login/:user_id', (req, res) => {
    res.cookie('user_id', req.params.user_id);
    res.redirect('/');
  })


  // route to user home page
  router.get('/', (req, res) => {
    // user is the cookie num
    const userID = req.cookies.user_id;


    selectAllUsers(db)
      .then((users) => {
        console.log(users)
        // res.json({users})
      })


    if (!userID) {
      res.redirect(401, '/');
    } else {
      res.render('users', { user: req.cookies.user_id });
    }
  })

  // logout using /users/logout
  router.get('/logout', (req, res) => {
    res.clearCookie('user_id');
    res.redirect('/');
  })

  return router;

};

