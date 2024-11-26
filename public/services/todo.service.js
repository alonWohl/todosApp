const BASE_URL = '/api/todo/'

export const todoService = {
  query,
  get,
  remove,
  save,
  getEmptyTodo,
  getDefaultFilter,
  getFilterFromSearchParams,
  getPriorityStats
}

function query(filterBy = {}) {
  return axios.get(BASE_URL, { params: { ...filterBy } }).then(res => res.data)
}

function get(todoId) {
  return axios.get(BASE_URL + todoId).then(res => res.data)
}

function remove(todoId) {
  return axios.delete(BASE_URL + todoId)
}

function save(todo) {
  const method = todo._id ? 'put' : 'post'
  return axios[method](BASE_URL, todo).then(res => res.data)
}

function getEmptyTodo(txt = '', priority = 5) {
  return { txt, priority, isDone: false }
}

function getDefaultFilter() {
  return { txt: '', priority: 0 }
}

function getFilterFromSearchParams(searchParams) {
  const defaultFilter = getDefaultFilter()
  const filterBy = {}
  for (const field in defaultFilter) {
    filterBy[field] = searchParams.get(field) || ''
  }
  return filterBy
}

function getPriorityStats() {
  return axios.query(TODO_KEY).then(todos => {
    const todoCountByPriorityMap = _getTodoCountByPriorityMap(todos)
    const data = Object.keys(todoCountByPriorityMap).map(speedName => ({ title: speedName, value: todoCountByPriorityMap[speedName] }))
    return data
  })
}

function _getTodoCountByPriorityMap(todos) {
  const todoCountByPriorityMap = todos.reduce(
    (map, todo) => {
      if (todo.priority < 3) map.low++
      else if (todo.priority < 7) map.normal++
      else map.urgent++
      return map
    },
    { low: 0, normal: 0, urgent: 0 }
  )
  return todoCountByPriorityMap
}
