const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) =>
{
  if(err) {
      return console.log("Unable to MongoDB server");
  }
  console.log("Connected to MongoDB server");

  //  db.collection("Users").deleteMany({name : "Sathish"}).then((result) => {
  //   console.log(result);
  //   // console.log(JSON.stringify(docs, undefined, 2));
  //   }, (err) => {
  //      console.log("Unable to get the documents");
  //   });

  // db.collection("Todos").deleteOne({text : "Eat the lunch"}).then((result) => {
  //   console.log(result);
  //   // console.log(JSON.stringify(docs, undefined, 2));
  //   }, (err) => {
  //      console.log("Unable to get the documents");
  //   });

  db.collection("Users").findOneAndDelete({_id : new ObjectID("5aaf7a2772298bc4fc26ab06")}).then((result) => {
    console.log(result);
    // console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
       console.log("Unable to get the documents");
    });

  db.close();
});