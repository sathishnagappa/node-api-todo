var express = require("express");
var bodyParser = require("body-parser");
var {mongoose} = require("./db/mongoose");
var  {Todo} = require("./models/todo");
var  {Users} = require("./models/users");

var app = express();

app.listen(3000, () => {
console.log("Started on port 3000");
})

app.use(bodyParser.json());

app.post("/todos", (req,res) => {
// console.log(req.body);
var newTodo = new Todo({
    text : req.body.text
});

newTodo.save().then((doc) => {
//   console.log("Saved Todo", doc);
res.send(doc);
}, (err) => {
    // console.log("Unable to save todo");
    res.status(400).send(err);
});
});
