const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
// Get the book list available in the shop using Promise
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  })
    .then((bookList) => {
      return res.status(200).json(bookList);
    })
    .catch((error) => {
      return res.status(500).json({
        message: "Error retrieving book list."
      });
    });
});

// Task 10: Get the book list available in the shop using async-await with Axios
public_users.get('/async-books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving book list."
    });
  }
});

// Get book details based on ISBN
// Get book details based on ISBN using Promise
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;

  new Promise((resolve, reject) => {
    const book = books[isbn];

    if (book) {
      resolve(book);
    } else {
      reject("Book not found.");
    }
  })
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((error) => {
      return res.status(404).json({
        message: error
      });
    });
});

// Task 11: Get book details based on ISBN using async-await with Axios
public_users.get('/async-isbn/:isbn', async function (req, res) {
  const { isbn } = req.params;

  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({
      message: "Book not found."
    });
  }
});

// Get book details based on author
// Get book details based on author using Promise
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;

  new Promise((resolve, reject) => {
    const filtered_books = Object.values(books).filter((book) => {
      return book.author.toLowerCase() === author.toLowerCase();
    });

    if (filtered_books.length > 0) {
      resolve(filtered_books);
    } else {
      reject("Books by this author not found.");
    }
  })
    .then((filtered_books) => {
      return res.status(200).json(filtered_books);
    })
    .catch((error) => {
      return res.status(404).json({
        message: error
      });
    });
});

// Task 12: Get book details based on author using async-await with Axios
public_users.get('/async-author/:author', async function (req, res) {
  const { author } = req.params;

  try {
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({
      message: "Books by this author not found."
    });
  }
});

// Get all books based on title
// Get all books based on title using Promise
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;

  new Promise((resolve, reject) => {
    const filtered_books = Object.values(books).filter((book) => {
      return book.title.toLowerCase() === title.toLowerCase();
    });

    if (filtered_books.length > 0) {
      resolve(filtered_books);
    } else {
      reject("Books with this title not found.");
    }
  })
    .then((filtered_books) => {
      return res.status(200).json(filtered_books);
    })
    .catch((error) => {
      return res.status(404).json({
        message: error
      });
    });
});

// Task 13: Get book details based on title using async-await with Axios
public_users.get('/async-title/:title', async function (req, res) {
  const { title } = req.params;

  try {
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({
      message: "Books with this title not found."
    });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params
  book_review = books[isbn].reviews
  //Write your code here
  return res.status(200).send(book_review);
});

module.exports.general = public_users;
