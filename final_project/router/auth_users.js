const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }

}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    let book = books[isbn];
    // get the new book review from request to be added / modified
    let newReview = req.query.review;
    // get the user of the request to see if user had already added a previous review
    let current_user = req.session.authorization.username;
    console.log('CurrentUser:', current_user)

    if (book) { //Check is book exists
        // Check if review is available in query parameter
        if (!req.query.review) {
            return res.status(400).json({ errorMessage: "Missing Review" });
        }
        // add new review from current user
        books[isbn].reviews[current_user] = newReview;

        //res.send(`Books with the new review  ${newReview} updated.`);
        res.send(books)
    }
    else{
        res.send("Unable to find book!");
    }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];
    const current_user = req.session.authorization.username;

    console.log('Current logged in User',current_user);

    // if book exists
    if (book) { 
        for (let review in books[isbn].reviews) {
            // if review belongs to current user
            if (review == current_user) {
                // remove users review
                delete books[isbn].reviews[current_user];
                console.log("Deleted:", review)
            }
        }
        res.send(books[isbn])
    }
    else{
        res.send("Unable to find book!");
    }
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
