const {ObjectID}  = require("mongodb");
const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {Users} = require("./../server/models/users");

var id = "5aafa4d802e3e3a444d6415f";

// if(!ObjectID.isValid(id)) {
//     console.log("ID not valid");
// }

// Todo.find({
//     _id : id
// }).then((todos) => {
//   console.log("Todos", todos);
// });

// Todo.findOne({
//     _id : id
// }).then((todo) => {
//   console.log("Todo", todo);
// });

// Todo.findById(id).then((todo) => {
//     if(!todo) {
//          return console.log("Id not found")
//     }
//   console.log("Todo by Id", todo);
// }).catch((e) => console.log(e) );

Users.findById(id).then((user) => {
    if(!user) {
         return console.log("Id not found")
    }
  console.log("Todo by Id", user);
}).catch((e) => console.log(e) );