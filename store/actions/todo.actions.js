import { todoService } from '../../services/todo.service.js'
import { userService } from '../../services/user.service.js'
import { ADD_TODO, REMOVE_TODO, SET_LOADING, SET_TODOS, SET_USER_SCORE, store, TOGGLE_TODO, UPDATE_TODO } from '../store.js'

export function loadTodos(filterBy) {
  store.dispatch({ type: SET_LOADING, isLoading: true })
  return todoService
    .query(filterBy)
    .then(todos => {
      store.dispatch({ type: SET_TODOS, todos })
    })
    .catch(err => {
      console.error('todo actions -> cannot set todos', err)
      throw err
    })
    .finally(() => {
      store.dispatch({ type: SET_LOADING, isLoading: false })
    })
}
export function removeTodo(todoId) {
  return todoService
    .remove(todoId)
    .then(() => {
      userService.addActivity(`removed todo`)
      store.dispatch({ type: REMOVE_TODO, todoId })
    })
    .catch(err => {
      console.error('todo actions -> cannot remove todo', err)
      throw err
    })
}
export function saveTodo(todo) {
  const type = todo._id ? UPDATE_TODO : ADD_TODO
  return todoService
    .save(todo)
    .then(savedTodo => {
      userService.addActivity(`saved todo: ${savedTodo.txt}`)
      store.dispatch({ type, todo: savedTodo })
      return savedTodo
    })
    .catch(err => {
      console.error('todo actions -> cannot save todo', err)
      throw err
    })
}

export function toggleTodo(todo) {
  const todoToSave = { ...todo, isDone: !todo.isDone }

  return todoService
    .save(todoToSave)
    .then(savedTodo => {
      completeTask()
      store.dispatch({ type: TOGGLE_TODO, todo: savedTodo })
      return savedTodo
    })
    .catch(err => {
      console.error('todo actions -> cannot toggle todo', err)
      throw err
    })
}

function completeTask() {
  return userService.updateBalance(10).then(newBalance => {
    store.dispatch({ type: SET_USER_SCORE, balance: newBalance })
    userService.addActivity('completed task')
  })
}
