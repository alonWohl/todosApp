import { userService } from '../../services/user.service.js'
import { SET_USER, store } from '../store.js'

export function login(credentials) {
  return userService
    .login(credentials)
    .then(user => {
      store.dispatch({ type: SET_USER, user })
    })
    .catch(err => {
      console.error('user actions -> cannot login', err)
      throw err
    })
}
export function signup(credentials) {
  return userService
    .signup(credentials)
    .then(user => {
      store.dispatch({ type: SET_USER, user })
    })
    .catch(err => {
      console.error('user actions -> cannot signup', err)
      throw err
    })
}

export function updateUser(userToUpdate) {
  return userService.update(userToUpdate).then(user => {
    store.dispatch({ type: SET_USER, user })
  })
}

export function logout() {
  return userService
    .logout()
    .then(() => {
      store.dispatch({ type: SET_USER, user: null })
    })
    .catch(err => {
      console.error('user actions -> cannot logout', err)
      throw err
    })
}
