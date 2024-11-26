import express from 'express'
import { todoService } from './services/todo.service.js'
import path from 'path'

const app = express()

// Config the Express App
app.use(express.static('public'))
app.use(express.json())

// List
app.get('/api/todo', (req, res) => {
  const filterBy = {
    txt: req.query.txt || '',
    priority: +req.query.priority || 0,
    labels: req.query.select || 'all'
  }

  todoService.query(filterBy).then(todos => {
    res.send(todos)
  })
})

// Read
app.get('/api/todo/:todoId', (req, res) => {
  const { todoId } = req.params
  todoService
    .getById(todoId)
    .then(todo => {
      res.send(todo)
    })
    .catch(err => {
      console.log('Error:', err)
      res.status(401).send('Cannot get todo')
    })
})

// Delete
app.delete('/api/todo/:todoId', (req, res) => {
  const { todoId } = req.params
  todoService
    .remove(todoId)
    .then(() => {
      res.send(`Todo id : ${todoId} deleted`)
    })
    .catch(err => {
      console.log('Had issues :', err)
      res.status(401).send('Cannot remove todo')
    })
})

// Create
app.post('/api/todo', (req, res) => {
  const todo = req.body
  todoService.save(todo).then(addedTodo => {
    res.send(addedTodo)
  })
})

// Update
app.put('/api/todo', (req, res) => {
  const todo = req.body
  console.log('todo:', todo)

  todoService
    .save(todo)
    .then(savedTodo => {
      res.send(savedTodo)
    })
    .catch(err => {
      console.log('Had issues:', err)
    })
})

// USER
app.get('/api/user', (req, res) => {
  userService
    .query()
    .then(users => res.send(users))
    .catch(err => res.status(500).send('Cannot get users'))
})

app.get('/api/user/:userId', (req, res) => {
  const { userId } = req.params

  userService
    .getById(userId)
    .then(user => res.send(user))
    .catch(err => res.status(500).send('Cannot get user'))
})

app.delete('/api/user/:userId', (req, res) => {
  const { userId } = req.params
  todoService
    .hasTodos(userId)
    .then(() => {
      userService
        .remove(userId)
        .then(() => res.send('Removed!'))
        .catch(err => res.status(401).send(err))
    })
    .catch(err => res.status(401).send('Cannot delete user with todos'))
})

// Autherize
app.post('/api/login', (req, res) => {
  console.log('req.body', req.body)
  const credentials = {
    username: req.body.username,
    password: req.body.password
  }
  // const credentials = req.body
  userService
    .checkLogin(credentials)
    .then(user => {
      if (user) {
        const loginToken = userService.getLoginToken(user)
        res.cookie('loginToken', loginToken)
        res.send(user)
      } else {
        res.status(401).send('Invalid credentials')
      }
    })
    .catch(err => res.status(401).send(err))
})

app.post('/api/logout', (req, res) => {
  res.clearCookie('loginToken')
  res.send('Logged out')
})

app.post('/api/signup', (req, res) => {
  const credentials = req.body
  console.log('credentials', credentials)

  userService.save(credentials).then(user => {
    const loginToken = userService.getLoginToken(user)
    res.cookie('loginToken', loginToken)
    res.send(user)
  })
})

// Fallback route
app.get('/**', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

const port = 3030

app.listen(port, () => {
  console.log(`Server is ready at ${port} http://127.0.0.1:${port}/`)
})
