const {ObjectID}  = require("mongodb");
const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {Users} = require("./../server/models/users");




Todo.findByIdAndRemove("5ab2211be51d115c8829f1f5").then((todo) => {
   console.log(todo);
});