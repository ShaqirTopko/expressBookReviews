const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users[username]) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users[username] = { password };
    return res.status(201).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 2));
});

//Based on ISBN 
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.send(JSON.stringify(book, null, 2));
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author);
    if (booksByAuthor.length > 0) {
        res.send(JSON.stringify(booksByAuthor, null, 2));
    } else {
        res.status(404).json({ message: "No books found by this author" });
    }
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title);
    if (booksByTitle.length > 0) {
        res.send(JSON.stringify(booksByTitle, null, 2));
    } else {
        res.status(404).json({ message: "No books found with this title" });
    }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.send(JSON.stringify(book.reviews, null, 2));
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});


module.exports.general = public_users;
