const BASE_URL = 'api/todo'

export const todoService = {
  query,
  get,
  remove,
  save,
  getEmptyTodo,
  getDefaultFilter,
  getFilterFromSearchParams,
  getImportanceStats
}

function query(filterBy = {}) {
  return axios.get(BASE_URL, { params: { ...filterBy } }).then(res => res.data)
}

function get(todoId) {
  return axios.get(TODO_KEY + todoId).then(res => res.data)
}

function remove(todoId) {
  return axios.delete(TODO_KEY + todoId)
}

function save(todo) {
  const method = todo._id ? 'put' : 'post'
  return axios[method](BASE_URL, bug).then(res => res.data)
}

function getEmptyTodo(txt = '', importance = 5) {
  return { txt, importance, isDone: false }
}

function getDefaultFilter() {
  return { txt: '', importance: 0 }
}

function getFilterFromSearchParams(searchParams) {
  const defaultFilter = getDefaultFilter()
  const filterBy = {}
  for (const field in defaultFilter) {
    filterBy[field] = searchParams.get(field) || ''
  }
  return filterBy
}

function getImportanceStats() {
  return axios.query(TODO_KEY).then(todos => {
    const todoCountByImportanceMap = _getTodoCountByImportanceMap(todos)
    const data = Object.keys(todoCountByImportanceMap).map(speedName => ({ title: speedName, value: todoCountByImportanceMap[speedName] }))
    return data
  })
}

function _getTodoCountByImportanceMap(todos) {
  const todoCountByImportanceMap = todos.reduce(
    (map, todo) => {
      if (todo.importance < 3) map.low++
      else if (todo.importance < 7) map.normal++
      else map.urgent++
      return map
    },
    { low: 0, normal: 0, urgent: 0 }
  )
  return todoCountByImportanceMap
}
