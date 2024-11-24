import { todoService } from '../../services/todo.service.js'
import { store } from '../store.js'
import { ADD_TODO, REMOVE_TODO, SET_LOADING, SET_TODOS, UPDATE_TODO } from '../reducers/todo.reducer.js'
import { addActivity } from './user.actions.js'

export function loadTodos() {
  const filterBy = store.getState().todoModule.filterBy

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
      store.dispatch({
        type,
        todo: savedTodo
      })
      return savedTodo
    })
    .then(res => {
      const actionName = todo._id ? 'Updated' : 'Added'
      return addActivity(`${actionName} a Todo: ` + todo.txt).then(() => res)
    })
    .catch(err => {
      console.error('Cannot save todo:', err)
      throw err
    })
}
