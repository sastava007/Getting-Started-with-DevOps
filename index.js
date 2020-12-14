const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT = 8080;

const app = express();

/* middleware */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* connect to a mongodb instance */
mongoose.connect('mongodb://mongo:27017/todos', {useNewUrlParser: true})
    .then(()=>{
        console.log('connected to database');
    })
    .catch((err)=>{
        console.log('Error:', err);
    })

const Todo = require('./model.js');

app.get('/', (req, res)=>{
    Todo.find((err, todos) => {
        if(err)
            console.log(err);
        else
            res.json(todos);
    })
});

app.get('/:id', (req, res) => {
    Todo.findById(req.params.id, (err, todo) =>{
        res.json(todo);
    });
});

app.post('/update/:id', (req, res) =>{
    Todo.findById(req.params.id, (err, todo) =>{

        if(!todo)
            res.status(404).send("Data doesn't exist!");
        else {
            todo.description = req.body.description;
            todo.responsible = req.body.responsible;
            todo.priority = req.body.priority;
            todo.completed = req.body.completed;
            
            todo.save().then(todo =>{
                res.status(200).json('todo updated!');
            })
            .catch(err=>{
                res.status(400).send("update not possible");
            });
        }    
    });
})

app.post('/add', (req, res)=>{
    let todo = new Todo(req.body);
    todo.save().then(todo =>{
        res.status(200).json({'todo':'todo added successfully'});
    })
    .catch(err=>{
        res.status(400).send('adding a new todo failed');
    });
})

app.listen(PORT, ()=>{
    console.log("Server started on port 8080");
});