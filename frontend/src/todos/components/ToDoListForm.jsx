import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import CheckBoxIcon from '@material-ui/icons/Check'
import Typography from '@material-ui/core/Typography'
import NotificationsIcon from '@material-ui/icons/Notifications'
import { TextField } from '../../shared/FormFields'
import communication from '../../communication/communication.js'

const useStyles = makeStyles({
  card: {
    margin: '1rem'
  },
  todoLine: {
    display: 'flex',
    alignItems: 'center'
  },
  textField: {
    flexGrow: 1
  },
  standardSpace: {
    margin: '8px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  }
})



export const ToDoListForm = ({ toDoList, saveToDoList }) => {
  const classes = useStyles()
  
  const [todos, setTodos] = useState(toDoList.todos)

  const updateData = async () => {
    toDoList.todos = todos
    
    fetch("http://localhost:3001/todos/" + toDoList.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toDoList),
        params: {"id": parseInt(toDoList.id)}
    })
}

  const handleSubmit = event => {
    event.preventDefault()
    updateData()
    saveToDoList(toDoList.id, { todos })
    
  }

  useEffect( () => {
    const timer = setTimeout(() => {
      saveToDoList(toDoList.id, { todos });
      updateData();
      
    }, 200);
    return () => clearTimeout(timer);

  }, [todos])

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography component='h2'>
          {toDoList.title}
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form}>
          {todos.map((currentTodo, index) => (
            <div key={index} className={classes.todoLine}>
              <Typography className={classes.standardSpace} variant='h6'>
                {index + 1}
              </Typography>

              <TextField
                label='What to do?'
                value={currentTodo.todo}
                onChange={event => {
                  setTodos([ // immutable update
                    ...todos.slice(0, index),
                    {todo: event.target.value, checked: currentTodo.checked, date: currentTodo.date},
                    ...todos.slice(index + 1)
                  ])
                }}
                className={classes.textField}
              />

              <TextField
                type="date"
                className={classes.textField}
                label={"(yyyy-mm-dd)"}
                value={currentTodo.date}
                onChange={event => {
                  setTodos([ // immutable update
                    ...todos.slice(0, index),
                    {todo: currentTodo.todo, checked: currentTodo.checked, date: event.target.value},
                    ...todos.slice(index + 1)
                  ])
                }}
              />

              <TextField
                type="date"
                className={classes.textField}
                label={"Time left in days"}
                value={isNaN(parseInt(((new Date(currentTodo.date)) - new Date())/(24*3600*1000))) || currentTodo.date.length !== 10 ? "Enter date" : parseInt(((new Date(currentTodo.date)) - new Date())/(24*3600*1000))}
              />

              {/* Button for completion */}
              <Button
                size='small'
                color='secondary'
                className={classes.standardSpace}
                onClick={() => {
                  setTodos([
                    ...todos.slice(0, index),
                    {todo: currentTodo.todo, checked: !currentTodo.checked, date: currentTodo.date},
                    ...todos.slice(index + 1)
                  ])

                }}
              >              
                {currentTodo.checked? <CheckBoxIcon /> : <NotificationsIcon />}
              </Button>

              {/* Button for deletion */}
              <Button
                size='small'
                color='secondary'
                className={classes.standardSpace}
                onClick={() => {
                  setTodos([ // immutable delete
                    ...todos.slice(0, index),
                    ...todos.slice(index + 1)
                  ])
                }}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}
          <CardActions>
            {/* Button for adding todos */}
            <Button
              type='button'
              color='primary'
              onClick={() => {
                setTodos([...todos, {todo: '', checked: false, date: 'yyyy-mm-dd'}])
              }}
            >
              Add Todo <AddIcon />
            </Button>

            {/* Button for saving todos */}
            <Button 
              type='submit' 
              variant='contained' 
              color='primary' 
            >
              Save
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}
