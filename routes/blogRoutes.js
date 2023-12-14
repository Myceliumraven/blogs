const express = require('express');
const router = express.Router();
const db = require('../database.js');

// Route to display all blog posts
router.get('/', (req, res) => {
    db.all('SELECT * FROM posts ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.render('index', { posts: rows });
    });
});

// Route to display the form for a new blog post
router.get('/new', (req, res) => {
    res.render('new');
});

// Route to add a new blog post
router.post('/', (req, res) => {
    const { title, content } = req.body;
    db.run('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content], (err) => {
        if (err) {
            throw err;
        }
        res.redirect('/blogs');
    });
});
// Route to handle the removal of a blog post
router.post("/:id/remove", (req, res) => {
    // Extraction of the post ID from the request parameters
    const postId = req.params.id;
    // Delete the specified post from the database
    db.run("DELETE FROM posts WHERE id = ?", [postId], (err) => {
      if (err) {
        // it handles database deletion errors
        console.error(err.message);
        res.status(500).send("Internal Server Error");
      } else {
        // Redirection of the main blogs the main blogs page after successful deletion
        res.redirect("/blogs");
      }
    });
  });
module.exports = router;