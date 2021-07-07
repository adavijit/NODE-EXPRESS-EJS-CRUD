require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");

const app = express();
const PORT = process.env.NODE_PORT || 3000;
//CONECTING DB// APP CONFIG
console.log(process.env.DBNAME);
mongoose.connect(
  `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.URL}?authSource=admin&tls=true&tlsCAFile=./public/ca-cert.crt`,
  {
    dbName: process.env.DBNAME,
    user: process.env.USER,
    pass: process.env.PASSWORD,
    useNewUrlParser: true,
  }
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

//SCHEMA
let blogSchema = mongoose.Schema({
  title: String,
  image: {
    type: String,
    default: "imagePlaceholder.jpg",
  },
  body: String,
  created: {
    type: Date,
    default: Date.now,
  },
});

//MODEL

let Blog = mongoose.model("Blog", blogSchema);

//SAMPLE BLOG
// Blog.create({
//     title: 'My first Academy',
//     image: 'https://images.unsplash.com/photo-1551517725-b926592c4280?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
//     body: 'Hello this is a blog post'
// })

//RESTFUL ROUTES
app.get("/", (req, res) => {
  console.log("esche");
  res.redirect("/blogs");
});

//INDEX ROUTES

app.get("/blogs", (req, res) => {
  //RETRIEVING ALL BLOGS
  Blog.find({}, (error, blogs) => {
    if (error) {
      console.log(error);
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

//NEW ROUTE
app.get("/blogs/new", (req, res) => {
  res.render("new");
});

//CREATE
app.post("/blogs", (req, res) => {
  //create blog
  Blog.create(req.body.blog, (error, newBlog) => {
    if (error) {
      res.render("new");
    } else {
      //redirect to index page
      res.redirect("/blogs");
    }
  });
});
//SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (error, foundBlog) => {
    if (error) {
      res.redirect("/blogs");
    } else {
      res.render("show", { blog: foundBlog });
    }
  });
});

//EDIT
app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (error, foundBlog) => {
    if (error) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});

//UPDATE ROUT
app.put("/blogs/:id", (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (error, updatedBlog) => {
    if (error) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//DELETE ROUTE
app.delete("/blogs/:id", (req, res) => {
  //DESTROY BLOG
  Blog.findByIdAndRemove(req.params.id, (error) => {
    if (error) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

app.listen(PORT, (req, res) => {
  console.log(`The server is up and running on port ${PORT}`);
});
