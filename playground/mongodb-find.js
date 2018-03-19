const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) =>
{
  if(err) {
      return console.log("Unable to MongoDB server");
  }
  console.log("Connected to MongoDB server");

  // db.collection("Todos").find({_id : new ObjectID('5aaea744d9c1a03cdc35f991')}).toArray().then((docs) => {
  // console.log("Todo Details");
  // console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //    console.log("Unable to get the documents");
  // });
  // db.collection("Todos").find().count().then((count) => {
  //   console.log("Todo Count: " + count);
  //   // console.log(JSON.stringify(docs, undefined, 2));
  //   }, (err) => {
  //      console.log("Unable to get the documents");
  //   });

  db.collection("Users").find({name : "Sathish"}).toArray().then((docs) => {
    // console.log("Todo Count: " + count);
    console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
       console.log("Unable to get the documents");
    });

  db.close();
});