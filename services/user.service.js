import { storageService } from './async-storage.service.js'

export const userService = {
  getLoggedinUser,
  login,
  logout,
  signup,
  getById,
  query,
  getEmptyCredentials,
  addActivity,
  updateBalance,
  update
}
const STORAGE_KEY_LOGGEDIN = 'user'
const STORAGE_KEY = 'userDB'

function query() {
  return storageService.query(STORAGE_KEY)
}

function getById(userId) {
  return storageService.get(STORAGE_KEY, userId)
}

function login({ username, password }) {
  return storageService.query(STORAGE_KEY).then(users => {
    const user = users.find(user => user.username === username)
    if (user) return _setLoggedinUser(user)
    else return Promise.reject('Invalid login')
  })
}

function signup({ username, password, fullname }) {
  const user = { username, password, fullname }
  user.createdAt = user.updatedAt = Date.now()
  user.balance = 10000
  user.activities = []

  return storageService.post(STORAGE_KEY, user).then(_setLoggedinUser)
}

function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
  return Promise.resolve()
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function _setLoggedinUser(user) {
  const userToSave = {
    _id: user._id,
    fullname: user.fullname,
    balance: user.balance,
    activities: user.activities || [],
    prefs: user.prefs || { color: '#000', bgColor: '#ffff' }
  }

  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
  return userToSave
}

function getEmptyCredentials() {
  return {
    fullname: '',
    username: 'muki',
    password: 'muki1'
  }
}

function addActivity(activityTxt) {
  const loggedInUserId = getLoggedinUser()._id
  return userService
    .getById(loggedInUserId)
    .then(user => {
      const activity = { txt: activityTxt, at: Date.now() }
      user.activities.push(activity)

      return storageService.put(STORAGE_KEY, user)
    })
    .then(user => {
      _setLoggedinUser(user)
      return user
    })
}

function updateBalance(amount) {
  const loggedInUserId = getLoggedinUser()._id
  return userService
    .getById(loggedInUserId)
    .then(user => {
      user.balance += amount
      return storageService.put(STORAGE_KEY, user)
    })
    .then(user => {
      _setLoggedinUser(user)
      return user.balance
    })
}

function update(userToUpdate) {
  const loggedInUserId = getLoggedinUser()._id
  return getById(loggedInUserId)
    .then(user => {
      const updatedUser = { ...user, ...userToUpdate }
      return storageService.put(STORAGE_KEY, updatedUser)
    })
    .then(user => {
      _setLoggedinUser(user)
      return user
    })
}
