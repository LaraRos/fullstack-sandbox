import React, { useState } from 'react'
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
  let timer = undefined
  const classes = useStyles()
  const [todos, setTodos] = useState(toDoList.todos)

  const handleSubmit = event => {
    event.preventDefault()
    saveToDoList(toDoList.id, { todos })
    communication.updateData(toDoList)
  }

  const handleChange = event => {
    event.preventDefault()
    saveToDoList(toDoList.id, { todos })
    debounce(1000)
  }

  const debounce = (delay) => {
    console.log("hi")
    if(timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(function() {
      // Call function
      communication.updateData(toDoList)
      // Set timer to undefined
      timer = undefined;
    }, delay);
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography component='h2'>
          {toDoList.title}
        </Typography>
        <form onChange={handleChange} className={classes.form}>
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
                    {todo: event.target.value, checked: false},
                    ...todos.slice(index + 1)
                  ])
                }}
                className={classes.textField}
              />

              {/* Button for completion */}
              <Button
                size='small'
                color='secondary'
                className={classes.standardSpace}
                onClick={() => {
                  currentTodo.checked = !currentTodo.checked
                  
                  // communication.updateData(toDoList)
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
                  // communication.updateData(toDoList)
                }}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}
          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={() => {
                setTodos([...todos, '']);
              }}
            >
              Add Todo <AddIcon />
            </Button>
            <Button 
              type='submit' 
              variant='contained' 
              color='primary' 
              // onClick = {() => communication.updateData(toDoList)} //put data
            >
              Save
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}
