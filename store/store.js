import { userService } from '../services/user.service.js'

const { createStore } = Redux

export const SET_TODOS = 'SET_TODOS'
export const REMOVE_TODO = 'REMOVE_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'
export const ADD_TODO = 'ADD_TODO'
export const TOGGLE_TODO = 'TOGGLE_TODO'

export const SET_USER = 'SET_USER'
export const SET_USER_SCORE = 'SET_USER_SCORE'
export const SET_USER_ACTIVITIES = 'SET_USER_ACTIVITIES'
export const SET_LOADING = 'SET_LOADING'

const initialValue = {
  user: {},
  todos: [],
  isLoading: false,
  loggedInUser: userService.getLoggedinUser()
}

function AppReducer(state = initialValue, cmd = {}) {
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

    case SET_USER:
      return {
        ...state,
        loggedInUser: cmd.user
      }
    case SET_USER_SCORE:
      const loggedInUser = { ...state.loggedInUser, balance: cmd.balance }
      return { ...state, loggedInUser }

    case SET_LOADING:
      return { ...state, isLoading: !state.isLoading }

    default:
      return state
  }
}

export const store = createStore(AppReducer)
window.gStore = store
