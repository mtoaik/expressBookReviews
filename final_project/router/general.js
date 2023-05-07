const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Registering user with parameters within body of request
    const username = req.body.username;
    const password = req.body.password;
    // Error if username and password are not provided
    if (username && password) {
        // check if user name has valid format of if username already exists
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    async_getBooks()
        .then(response => {
            return res.send(response);
        }).catch(err => {
            return res.status(404).json({ errorMessage: "Books not available" });
        })
    //res.send(JSON.stringify(books, null, 4));
    //return res.status(300).json({message: "Yet to be implemented"});
});

function async_getBooks() {
    return new Promise((resolve) => {
        resolve(JSON.stringify(books, null, 4));
    });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    async_getBook(isbn)
        .then(book => {
            return res.send(book);
        }).catch(err => {
            return res.status(404).json({ errorMessage: err });
        })
    //return res.send(books[isbn])
    //return res.status(300).json({message: "Yet to be implemented"});
});

function async_getBook(isbn) {
    return new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not available");
        }
    });
}

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    console.log(author)
    async_getBooksbyAuthor(author)
        .then(response => {
            return res.send(response);
        }).catch(err => {
            return res.status(404).json({ errorMessage: err });
        })
    //return res.status(300).json({message: "Yet to be implemented"});
});


function async_getBooksbyAuthor(author) {
    return new Promise((resolve, reject) => {
        let foundBooks = [];
        for (let bookId in books) {
            if (books[bookId].author === author) {
                foundBooks.push(books[bookId]);
            }
        }
        if (foundBooks) {
            resolve(foundBooks);
        } else {
            reject("No books found for author");
        }
    });
}

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    console.log(title)
    async_getBooksByTitle(title)
    .then(response => {
      return res.send(response);
    }).catch(err => {
      return res.status(404).json({ errorMessage: err });
    })
    //return res.send(foundBooks)
    //return res.status(300).json({message: "Yet to be implemented"});
});

function async_getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
        let foundBooks = [];
        for (let bookId in books) {
            if (books[bookId].title === title) {
                foundBooks.push(books[bookId]);
            }
        }
        if (foundBooks) {
            resolve(foundBooks);
        } else {
            reject("No books found for title");
        }
    });
}

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    console.log(isbn)
    return res.send(books[isbn]["reviews"])
    //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
