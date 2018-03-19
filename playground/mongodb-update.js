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

// db.collection("Todos").findOneAndUpdate( {
//  _id : new ObjectID("5aaea6092df29a4ca8fcf493")
// }, 
// {
//   $set : {
//       completed : true
//   }
// },
// {
//     returnOriginal : false
// }
// ).then((result) => {
//     console.log(result);
//     // console.log(JSON.stringify(docs, undefined, 2));
//     }, (err) => {
//        console.log("Unable to get the documents");
//     });

    db.collection("Users").findOneAndUpdate( {
        _id : new ObjectID("5aaf6cd8e6365745685efe62")
       }, 
       {
         $set : {
             name : "Sathish"
         },
         $inc : {
             age : 1
         }
       },
       {
           returnOriginal : false
       }
       ).then((result) => {
           console.log(result);
           // console.log(JSON.stringify(docs, undefined, 2));
           }, (err) => {
              console.log("Unable to get the documents");
           });

  db.close();
});