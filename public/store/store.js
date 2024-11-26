import { todoReducer } from './reducers/todo.reducer.js'
import { userReducer } from './reducers/user.reducer.js'

const { createStore, combineReducers } = Redux

const rootReducer = combineReducers({
  userModule: userReducer,
  todoModule: todoReducer
})

export const store = createStore(rootReducer)
window.gStore = store
