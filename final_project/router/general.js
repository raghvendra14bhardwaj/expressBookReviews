const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    users.push({ username, password });

    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    try {
        // Simulating fetching books
        const fetchBooks = () => {
            return new Promise((resolve) => {
                // Resolve with your books data
                resolve(books);
            });
        };

        const booksData = await fetchBooks(); // Await the promise to get book data
        return res.status(200).json(booksData); // Send the books data in response
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const fetchBookByIsbn = (isbn) => {
            return new Promise((resolve, reject) => {
                const book = books[isbn];
                if (book) {
                    resolve(book);
                } else {
                    reject(new Error("Book not found"));
                }
            });
        };

        const book = await fetchBookByIsbn(isbn); // Await the promise to get book data
        return res.status(200).json(book); // Send the book data in response
    } catch (error) {
        return res.status(404).json({ message: error.message }); // Send 404 if book is not found
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    const author = req.params.author.toLowerCase();

    try {
        const fetchBooksByAuthor = (author) => {
            return new Promise((resolve, reject) => {
                const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author);
                if (booksByAuthor.length > 0) {
                    resolve(booksByAuthor);
                } else {
                    reject(new Error("No books found by this author"));
                }
            });
        };

        const booksByAuthor = await fetchBooksByAuthor(author); // Await the promise to get books by author
        return res.status(200).json(booksByAuthor); // Send the books data in response
    } catch (error) {
        return res.status(404).json({ message: error.message }); // Send 404 if no books are found
    }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const title = req.params.title.toLowerCase();

    try {
        const fetchBooksByTitle = (title) => {
            return new Promise((resolve, reject) => {
                const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title);
                if (booksByTitle.length > 0) {
                    resolve(booksByTitle);
                } else {
                    reject(new Error("No books found with this title"));
                }
            });
        };

        const booksByTitle = await fetchBooksByTitle(title); // Await the promise to get books by title
        return res.status(200).json(booksByTitle); // Send the books data in response
    } catch (error) {
        return res.status(404).json({ message: error.message }); // Send 404 if no books are found
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "No reviews found for this book" });
    }
});

module.exports.general = public_users;
