const express = require('express')
const cors = require('cors')
var bodyParser = require('body-parser')
const app = express()


app.use(cors())

// Needs to be here to read request body
// acquired from stack overflow
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const PORT = 3001 

let toDoList1 = {
    id: "0000000001",
    title: "First List",
    todos: [{todo: "First todo of first list!", checked: false}]}

let toDoList2 = {
    id: "0000000002",
    title: "Second List",
    todos: [{todo: "First todo of second list!", checked: false}]}

fullTodos = [toDoList1, toDoList2]

app.get('/', (req, res) => res.send("Hello World!"))

app.get('/todos', (req, res) => res.send(fullTodos))

app.put('/todos/:id', function(req, res) {
    console.log("Received put")
    let id = req.params.id - 1 // Subtract by 1 because list id starts at 1
    console.log(req.body)
    fullTodos[id] = req.body
    console.log(fullTodos[0].todos)
    res.send("Backend: PUT")
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))