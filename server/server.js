require("./config/config");
const _ = require("lodash");
const {ObjectID}  = require("mongodb");
const express = require("express");
const bodyParser = require("body-parser");
var {mongoose} = require("./db/mongoose");
var  {Todo} = require("./models/todo");
var  {Users} = require("./models/users");
var {authenticate} = require('./middleware/authenticate');

const port = process.env.PORT || 3000 ;
var app = express();

app.listen(port, () => {
console.log("Started on port " +  port);
})

app.use(bodyParser.json());

app.post("/todos", authenticate , (req,res) => {
var newTodo = new Todo({
    text : req.body.text,
    _creator : req.user[0]._id
});
newTodo.save().then((doc) => {
//   console.log("Saved Todo", doc);
res.send(doc);
}, (err) => {
    // console.log("Unable to save todo");
    res.status(400).send(err);
});
});

app.get("/todos", authenticate,  (req, res) => {
    Todo.find({ _creator : req.user[0]._id}).then((todos) => {
     res.send({todos});    
    }, (e) => {
      res.status(400).send(e);
    });
});

app.get("/todos/:id", authenticate, (req,res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
    Todo.findOne({
        _id : id,
        _creator : req.user[0]._id
    }).then((todo) => {
    if(todo) {
      return res.status(200).send({todo}); 
    }
    else
    {
       return res.status(404).send(); 
    }
    }).catch((e) => res.status(400).send()  );
});

app.delete("/todos/:id", authenticate, (req,res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
    Todo.findByIdAndRemove({
        _id : id,
        _creator : req.user[0]._id
    }).then((todo) => {
    if(todo) {
     return res.status(200).send({todo}); 
    }
    else
    {
       return res.status(404).send(); 
    }
    }).catch((e) => res.status(400).send()  );
});

app.patch("/todos/:id", authenticate , (req,res) => {
    var id = req.params.id;
    var body = _.pick(req.body,["text", "completed"]);

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else
    {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findOneAndUpdate({ _id : id , _creator : req.user[0]._id }, { 
        $set : body
    },  {new : true} ).then((todo) => {
          if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    })
});

app.post("/users", (req,res) => {

    var body = _.pick(req.body,["email", "password"]);
    var user = new Users(body);
    
    user.save().then(() => {
        return user.generateAuthToken();  
    }).then((token) => {        
        res.header("x-auth", token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});


app.get("/users/me",authenticate, (req,res) => {
res.send(req.user);
});

app.post("/users/login", (req,res) => {
    var body = _.pick(req.body,["email", "password"]);
    
    Users.findByCredentials(body.email,body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header("x-auth", token).send(user);
      });
    }).catch((e) => {
        res.status(400).send(e);
    }) 
});

app.delete("/users/me/token", authenticate , (req,res) => {
  req.user[0].removeToken(req.token).then(() => {
     res.status(200).send();
  }, () => {
      res.status(400).send();
  });
});

module.exports = {app};