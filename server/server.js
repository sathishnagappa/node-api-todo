
const _ = require("lodash");
const {ObjectID}  = require("mongodb");
const express = require("express");
const bodyParser = require("body-parser");
var {mongoose} = require("./db/mongoose");
var  {Todo} = require("./models/todo");
var  {Users} = require("./models/users");
const port = process.env.PORT || 3000 ;
var app = express();

app.listen(port, () => {
console.log("Started on port" +  port);
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

app.get("/todos", (req, res) => {
    Todo.find().then((todos) => {
     res.send({todos});    
    }, (e) => {
      res.status(400).send(e);
    });
});

app.get("/todos/:id",(req,res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
    Todo.findById(id).then((todo) => {
    if(todo) {
      return res.status(200).send({todo}); 
    }
    else
    {
       return res.status(404).send(); 
    }
    }).catch((e) => res.status(400).send()  );
});

app.delete("/todos/:id",(req,res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo) => {
    if(todo) {
      return res.status(200).send({todo}); 
    }
    else
    {
       return res.status(404).send(); 
    }
    }).catch((e) => res.status(400).send()  );
});

// app.patch("/todos/:id",(req,res) => {
//     var id = req.params.id;
//     var body = _.pick(req.body,["text", "completed"]);

//     if(!ObjectID.isValid(id)) {
//         return res.status(404).send();
//     }
//     if(_.isBoolean(body.completed && body.completed)) {
//         body.completedAt = new Date().getTime();
//     }
//     else
//     {
//         body.completed = false;
//         body.completedAt = null;
//     }
//     Todo.findByIdAndUpdate(id, { 
//         $set : body
//     },  {new : true} ).then((todo) => {
//         if(!todo) {
//             return res.status(404).send();
//         }
//         res.send({todo});
//     }).catch((e) => {
//         res.status(400).send();
//     })
// });

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
  
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
  
    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }
  
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
  
      res.send({todo});
    }).catch((e) => {
      res.status(400).send();
    })
  });
module.exports = {app};