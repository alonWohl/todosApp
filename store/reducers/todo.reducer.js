import { todoService } from '../../services/todo.service.js'

export const SET_TODOS = 'SET_TODOS'
export const REMOVE_TODO = 'REMOVE_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'
export const ADD_TODO = 'ADD_TODO'
export const TOGGLE_TODO = 'TOGGLE_TODO'
export const SET_LOADING = 'SET_LOADING'
export const SET_FILTER = 'SET_FILTER'

const initialValue = {
  filterBy: todoService.getDefaultFilter(),
  todos: []
}

export function todoReducer(state = initialValue, cmd = {}) {
  switch (cmd.type) {
    case SET_TODOS:
      return { ...state, todos: cmd.todos }
    case REMOVE_TODO:
      return { ...state, todos: state.todos.filter(todo => todo._id !== cmd.todoId) }
    case ADD_TODO:
      return { ...state, todos: [...state.todos, cmd.todo] }
    case UPDATE_TODO:
      return { ...state, todos: state.todos.map(todo => (todo._id === cmd.todo._id ? cmd.todo : todo)) }

    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo => (todo._id === cmd.todo._id ? cmd.todo : todo))
      }

    case SET_FILTER:
      return {
        ...state,
        filterBy: { ...state.filterBy, ...cmd.filterBy }
      }
    case SET_LOADING:
      return { ...state, isLoading: !state.isLoading }

    default:
      return state
  }
}
