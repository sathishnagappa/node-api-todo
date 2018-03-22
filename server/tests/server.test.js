const expect = require("expect");
const request = require("supertest");

const {ObjectID} = require("mongodb");
const {app} = require("./../server");
const {Todo} = require("./../models/todo");

const todos = [{
  "_id" : new ObjectID(),
 "text" : "This is test1"
},{
"_id" : new ObjectID(),
"text" : "This is test2",
 "completed" : true,
 "completedAt" : 333
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);        
    }).then(() => done());  
  }); 
 
describe("POST/todos", () => {
    it("should create a new todo", (done) => {
      var text = "a new todo";

      request(app)
      .post("/todos")
      .send({text})
      .expect(200)
      .expect((res) => {
          expect(res.body.text).toBe(text);
      })
      .end((err, res) =>{
        if(err) {
            return done(err);
        }

        Todo.find({text : "a new todo"}).then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
        }).catch((e) => done(e));        
      });
    });
    it("should not create todo with invalid fields", (done) => {
        var text = "a new todo";
  
        request(app)
        .post("/todos")
        .send({})
        .expect(400)
        .end((err, res) =>{
          if(err) {
              return done(err);
          }
  
          Todo.find().then((todos) => {
              expect(todos.length).toBe(2);
              done();
          }).catch((e) => done(e));        
        });
      });

});

describe("GET/todos", () => {
    it("should get all new todo", (done) => {
    
        request(app)
        .get("/todos")
        .expect(200)
        .send({todos})
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
});

describe("GET/todos/:id", (done) => {
it("should return todo doc", (done) => {
  request(app)
  .get("/todos/" + todos[0]._id.toHexString())
  .expect(200)
  .expect((res)=> {
      expect(res.body.todo.text).toBe(todos[0].text);
  })
  .end(done)
});
it("should return 404 for todo not found", (done) => {
    request(app)
    .get("/todos/" + new ObjectID().toHexString())
    .expect(404)
    .end(done)
});
it("should return 404 for non-objects", (done) => {
    request(app)
    .get("/todos/123")
    .expect(404)
    .end(done)
});
});

describe("DELETE/todos/:id", (done) => {
    it("should delete a todo", (done) => {
      request(app)
      .delete("/todos/" + todos[1]._id.toHexString())
      .expect(200)
      .expect((res)=> {
          expect(res.body.todo._id).toBe(todos[1]._id.toHexString());
      })
      .end((err, res) =>  {
            if(err) {
                 return done(err);   
            }

            Todo.findById(todos[1]._id.toHexString()).then((todo) => {
                expect(todo).toNotExist();
                done();
            }).catch((e) => done(e) );
            
      })
    });
    it("should return 404 if for todo not found", (done) => {
        request(app)
        .delete("/todos/" + new ObjectID().toHexString())
        .expect(404)
        .end(done)
    });
    it("should return 404 if for non-objects", (done) => {
        request(app)
        .delete("/todos/123")
        .expect(404)
        .end(done)
    });
    });

    describe("PATCH/todos", () => {
        it("should update the todo", (done) => {
        var text = "This is new test";
        request(app)
            .patch("/todos/" + todos[0]._id.toHexString())
            .send({
                text,
                completed : true
            })
            .expect(200)
            .expect((res)=> {
                    expect(res.body.todo.text).toBe(text);
                    expect(res.body.todo.completed).toBe(true);
                    expect(res.body.todo.completedAt).toBeA("number");                    
                })
            .end(done)
      
        });

        it("should clear completedAt when todo is not completed", (done) => {
            var text = "This is new test!!";
            request(app)
            .patch("/todos/" + todos[1]._id.toHexString())
            .send({
                completed : false,
                text                
            })
            .expect(200)
            .expect((res)=> {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
             })
             .end(done)
        });
    });