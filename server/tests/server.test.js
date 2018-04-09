const expect = require("expect");
const request = require("supertest");

const {ObjectID} = require("mongodb");
const {app} = require("./../server");
const {Todo} = require("./../models/todo");
const {Users} = require('./../models/users');
const {todos,populateTodos,users, populateUsers} = require("./seed/seed");

beforeEach(populateUsers);
beforeEach(populateTodos);   

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

    describe('GET /users/me', () => {
        it('should return user if authenticated', (done) => {
          request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
              expect(res.body[0]._id).toBe(users[0]._id.toHexString());
              expect(res.body[0].email).toBe(users[0].email);
            })
            .end(done);
        });
      
        it('should return 401 if not authenticated', (done) => {
          request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
              expect(res.body).toEqual({});
            })
            .end(done);
        });
      });

      describe('POST /users', () => {
        it('should create a user', (done) => {
            var email = "test@test.com";
            var password = "123qwqw";

            request(app)
            .post("/users")
            .send({email, password})
            .expect(200)
            .expect((res) =>  {
                expect(res.header["x-auth"]).toExist();    
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if(err) {
                    return done(err);
                }
               
                Users.findOne({email}).then((user) => {
                   expect(user).toExist();
                   expect(user.password).toNotBe(password);
                   done();    
                });
            })    
        });

        it('should return validation error if request invalid', (done) => {
            request(app)
            .post("/users")
            .set({email : "something", password : "something"})
            .expect(400)
            .end(done)
        });

        it('should not create user if email is in use', (done) => {            
            var email = "andrew@example.com";
            var password = "123qwqw";

            request(app)
            .post("/users")
            .send({email, password})
            .expect(400)
            .expect((res) =>  {
                expect(res.header["x-auth"]).toNotExist();    
                expect(res.body._id).toNotExist();
                expect(res.body.email).toNotExist(email);
            })
            .end(done)               
            });
      });