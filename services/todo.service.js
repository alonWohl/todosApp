import fs from 'fs'
import { utilService } from '../public/services/util.service.js'

export const todoService = {
  query,
  getById,
  remove,
  save,
  getPriorityStats
}

let gTodos = utilService.readJsonFile('data/todo.json')

function query(filterBy = {}) {
  let filteredTodos = [...gTodos]

  if (filterBy.txt) {
    const regExp = new RegExp(filterBy.txt, 'i')
    filteredTodos = filteredTodos.filter(todo => regExp.test(todo.txt))
  }

  if (filterBy.priority) {
    filteredTodos = filteredTodos.filter(todo => todo.priority >= filterBy.priority)
  }

  switch (filterBy.select) {
    case 'active':
      filteredTodos = filteredTodos.filter(todo => !todo.isDone)
      break
    case 'done':
      filteredTodos = filteredTodos.filter(todo => todo.isDone)
      break
    case 'all':
    default:
      break
  }

  return Promise.resolve(filteredTodos)
}

function getById(todoId) {
  const todo = gTodos.find(todo => todo._id === todoId)
  if (!todo) return Promise.reject('cannot find todo')

  todo.nextTodoId = _getNextTodoId(todoId)
  todo.prevTodoId = _getPrevTodoId(todoId)
  return Promise.resolve(todo)
}

function remove(todoId) {
  const idx = gTodos.findIndex(todo => todo._id === todoId)
  if (idx === -1) return Promise.reject('no todo found')

  gTodos.splice(idx, 1)
  return _saveTodosToFile()
}

function save(todo) {
  if (todo._id) {
    const idx = gTodos.findIndex(currTodo => currTodo._id === todo._id)
    if (idx === -1) return Promise.reject('No such todo')
    todo.updatedAt = Date.now()
    gTodos[idx] = { ...gTodos[idx], ...todo }
  } else {
    todo._id = utilService.makeId()
    todo.createdAt = todo.updatedAt = Date.now()
    gTodos.push(todo)
  }

  return _saveTodosToFile().then(() => todo)
}
function getPriorityStats() {
  const todoCountByPriorityMap = _getTodoCountByPriorityMap(gTodos)
  return Object.entries(todoCountByPriorityMap).map(([key, value]) => ({ title: key, value }))
}

function _getNextTodoId(todoId) {
  const idx = gTodos.findIndex(todo => todo._id === todoId)
  const nextTodo = gTodos[idx + 1] ? gTodos[idx + 1] : gTodos[0]
  return nextTodo._id
}

function _getPrevTodoId(todoId) {
  const idx = gTodos.findIndex(todo => todo._id === todoId)
  const prevTodo = gTodos[idx - 1] ? gTodos[idx - 1] : gTodos[gTodos.length - 1]
  return prevTodo._id
}

function _getTodoCountByPriorityMap(todos) {
  return todos.reduce(
    (map, todo) => {
      if (todo.priority < 3) map.low++
      else if (todo.priority < 7) map.normal++
      else map.urgent++
      return map
    },
    { low: 0, normal: 0, urgent: 0 }
  )
}

function _saveTodosToFile() {
  return new Promise((resolve, reject) => {
    fs.writeFile('data/todo.json', JSON.stringify(gTodos, null, 2), err => {
      if (err) {
        console.error('Cannot write to file:', err)
        reject(err)
      } else {
        console.log('Wrote successfully to file.')
        resolve()
      }
    })
  })
}
