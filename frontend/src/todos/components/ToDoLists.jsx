import React, { Fragment, useState, useEffect } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ReceiptIcon from '@material-ui/icons/Receipt'
import DoneAllIcon from '@material-ui/icons/DoneAll'
import Typography from '@material-ui/core/Typography'
import { ToDoListForm } from './ToDoListForm'
import communication from '../../communication/communication.js'

// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const getData = () => {
  return fetch('http://localhost:3001/todos', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
        }
  })
      .then(communication.handleHTTPError)
      .then(response => response.json())
      .catch(console.error)
}

const checkIfCompleted = (toDoList) => {
  return (toDoList.todos.filter(todo => todo.checked === false)).length === 0
}

const getPersonalTodos = () => {
  return getData()
    .then(result => ({
      '0000000001': result[0],
      '0000000002': result[1]
    }))

}
export const ToDoLists = ({ style }) => {
  const [toDoLists, setToDoLists] = useState({})
  const [activeList, setActiveList] = useState()

  useEffect(() => {
    getPersonalTodos()
      .then(setToDoLists)
  }, [])

  if (!Object.keys(toDoLists).length) return null
  return <Fragment>
    <Card style={style}>
      <CardContent>
        <Typography
          component='h2'
        >
          My ToDo Lists
        </Typography>
        <List>
          {Object.keys(toDoLists).map((key) => <ListItem
            key={key}
            button
            onClick={() => setActiveList(key)}
          >
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary={toDoLists[key].title} />
            {checkIfCompleted(toDoLists[key])? <DoneAllIcon />  : null}
          </ListItem>)}
        </List>
      </CardContent>
    </Card>
    {toDoLists[activeList] && <ToDoListForm
      key={activeList} // use key to make React recreate component to reset internal state
      toDoList={toDoLists[activeList]}

      saveToDoList = {(id, { todos }) => {
        const listToUpdate = toDoLists[id]

        setToDoLists({
          ...toDoLists,
          [id]: { ...listToUpdate, todos }
        })
      }}
    />}
  </Fragment>
}
