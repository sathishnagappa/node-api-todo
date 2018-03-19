const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) =>
{
  if(err) {
      return console.log("Unable to MongoDB server");
  }
  console.log("Connected to MongoDB server");

//   db.collection("Todos").insertOne({
//     text : "Sometime to do",
//     completed : false
// }, (err, result) =>
//  {
//   if(err){
//       return console.log("Unable to insert todo", err);
//   }
//   console.log(JSON.stringify(result.ops, undefined , 2));
//  });

 db.collection("Users").insertOne({
    name : "Sometime to do",
    age : 45,
    location: "JP Nagar"
}, (err, result) =>
 {
  if(err){
      return console.log("Unable to insert todo", err);
  }
  console.log(JSON.stringify(result.ops, undefined , 2));
//   console.log(result.ops[0]._id.getTimestamp());
 });

  db.close();
});