const mongoose = require("mongoose");
const express = require("express");
const ejs = require("ejs");

// Mongoose
const uri =
  "mongodb+srv://admin-vedant:Vedant7126@books.edg53.mongodb.net/booksDB?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
  console.log("Connected to DB")
);

const bookSchema = {
  imageUrl: String,
  name: String,
};

const blogSchema = {
  name: String,
  reviews: [],
};

const Book = mongoose.model("book", bookSchema);
const Blog = mongoose.model("blog", blogSchema);

// Server
const app = express();
let bookName = "";

// Middlewares
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/books", (req, res) => {
  Book.find({}, (err, result) => {
    if (err) console.log(err);
    else {
      res.render("books", {
        books: result,
      });
    }
  });
});
app.get("/books/:something", (req, res) => {
  res.render("404");
});

app.post("/books", (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const newBook = new Book({
    imageUrl: image,
    name,
  });
  const newBlog = new Blog({
    name,
    reviews: [],
  });
  newBlog.save();
  newBook.save();
  res.redirect("/books");
});

app.get("/reviews/", (req, res) => {
  Blog.findOne({ name: req.query.bookName }, (err, result) => {
    if (err) console.log(err);
    else {
      if (!result) {
        res.render("404");
      } else {
        res.render("reviews", {
          bookName: result.name,
          reviews: result.reviews,
        });
        console.log("Match Found!");
        bookName = req.query.bookName;
        console.log(bookName);
      }
    }
  });
});

app.post("/reviews/", (req, res) => {
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  console.log(bookName);
  Blog.findOne({ name: bookName }, (err, result) => {
    if (err) console.log(err);
    else {
      if (!result) {
        res.render("404");
      } else {
        const newReview = {
          content: req.body.review,
          title: req.body.title,
          date: `${date.getDate()}/${month + 1}/${year}`,
        };
        result.reviews.push(newReview);
        result.save();
        res.redirect("/reviews/?bookName=" + bookName);
      }
    }
  });
});

app.get("/favicon.ico", (req, res) => {
  res.send("<h1>No Favicon</h1>");
});

// Listening on port 3000
app.listen(process.env.PORT, () =>
  console.log("Server running on" + process.env.PORT)
);
