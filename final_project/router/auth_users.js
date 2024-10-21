const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    // Validate user credentials
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ username: user.username }, 'gbhj28jhbftr5opmnqth76u2jb6hy0u1', { expiresIn: '1h' });
    // Respond with the token
    return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params; // Retrieve the ISBN from request parameters
    const { review } = req.body; // Extract the review from the request body
    const username = req.username; // Get the username of the authenticated user

    // Check if the book exists
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if review is provided
    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    // Add the review to the book
    if (!book.reviews[username]) {
        book.reviews[username] = []; // Initialize reviews for the user if not already present
    }
    book.reviews[username].push(review); // Add the review

    return res.status(200).json({ message: "Review added successfully", book });
});

//Deletes existing review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const username = req.username; 
    reviews = reviews.filter(review => !(review.isbn === isbn && review.username === username));

    return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.users = users;
