require("./config/config");
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
console.log("Started on port " +  port);
})

app.use(bodyParser.json());

app.post("/todos", (req,res) => {
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

app.patch("/todos/:id",(req,res) => {
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
    Todo.findByIdAndUpdate(id, { 
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

var authenticate = (req,res,next) => {
    var token = req.header("x-auth");
    Users.findByToken(token).then((user) => {
     if(!user) {
          return Promise.reject();
     }  
     req.user = user;
     req.token = token; 
     next();
    }).catch((e) => {
       return res.status(401).send();
    });
}

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