const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

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
    const { review } = req.body;
    const { isbn } = req.params;
    const username = req.username;

    // Validate input
    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    // Check if the review exists for this ISBN
    const existingReviewIndex = reviews.findIndex(r => r.isbn === isbn && r.username === username);
    if (existingReviewIndex !== -1) {
        // Modify existing review
        reviews[existingReviewIndex].review = review;
        return res.status(200).json({ message: "Review updated successfully" });
    }

    // Add new review
    reviews.push({ isbn, username, review });
    return res.status(201).json({ message: "Review added successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
