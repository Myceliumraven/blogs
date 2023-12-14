const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const db = require('../database'); // Ensure this path is correct
const router = express.Router();

// Blog Routes
// Route to display all blog posts
router.get('/blogs', (req, res) => {
  db.all('SELECT * FROM posts ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error(err);
      res.redirect('/');
    } else {
      res.render('index', { posts: rows });
    }
  });
});

// Route to display the form for a new blog post
router.get('/blogs/new', (req, res) => {
  res.render('new');
});

// Route to add a new blog post
router.post('/blogs', async (req, res) => {
  const { title, content, category } = req.body;
  try {
    await db.run('INSERT INTO posts (title, content, category) VALUES (?, ?, ?)', [title, content, category]);
    res.redirect('/blogs');
  } catch (err) {
    console.error(err);
    res.render('new', { errorMessage: 'Error creating Blog' });
  }
});

// Route to delete a blog post
router.delete('/blogs/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM posts WHERE id = ?', req.params.id);
    res.redirect('/blogs');
  } catch (err) {
    console.error(err);
    res.redirect('/blogs');
  }
});

// Authentication Routes
// Signup route
router.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Add user to the database
    const { username, email } = req.body;
    const addUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    await db.run(addUserQuery, [username, email, hashedPassword]);
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.redirect('/signup');
  }
});

// Login route
router.post('/login', passport.authenticate('local', {
  successRedirect: '/blogs',
  failureRedirect: '/login',
  failureFlash: true // Ensure you have flash messages configured
}));

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    res.redirect('/login');
  });
});

// Route to display the login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Route to display the signup form
router.get('/signup', (req, res) => {
  res.render('signup');
});

module.exports = router;