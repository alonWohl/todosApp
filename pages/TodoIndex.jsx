import { TodoFilter } from '../cmps/TodoFilter.jsx'
import { TodoList } from '../cmps/TodoList.jsx'
import { DataTable } from '../cmps/data-table/DataTable.jsx'
import { todoService } from '../services/todo.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { loadTodos, removeTodo, saveTodo } from '../store/actions/todo.actions.js'
import { AppLoader } from '../cmps/AppLoader.jsx'
import { changeBalance } from '../store/actions/user.actions.js'
import { SET_FILTER } from '../store/reducers/todo.reducer.js'

const { useState, useEffect } = React
const { useSelector, useDispatch } = ReactRedux
const { Link, useSearchParams } = ReactRouterDOM

export function TodoIndex() {
  const todos = useSelector(storeState => storeState.todoModule.todos)
  const filterBy = useSelector(storeState => storeState.todoModule.filterBy)

  const dispatch = useDispatch()

  useEffect(() => {
    loadTodos().catch(err => {
      showErrorMsg('Cannot load todos')
    })
  }, [filterBy])

  function onRemoveTodo(todoId) {
    const doConfirm = confirm('Are you sure ?')
    if (doConfirm) {
      removeTodo(todoId)
        .then(() => {
          showSuccessMsg(`Todo removed`)
        })
        .catch(err => {
          console.log('err:', err)
          showErrorMsg('Cannot remove todo ' + todoId)
        })
    }
  }

  function onToggleTodo(todo) {
    const todoToSave = { ...todo, isDone: !todo.isDone }
    saveTodo(todoToSave)
      .then(() => {
        showSuccessMsg(`Updated ${todoToSave.txt} successfully`)
        if (todoToSave.isDone) {
          return changeBalance(10)
        }
      })
      .catch(() => showErrorMsg('Had trouble updating the todo'))
  }

  function onSetFilterBy(filterBy) {
    dispatch({ type: SET_FILTER, filterBy })
  }

  return (
    <React.Fragment>
      <section className="todo-index">
        <TodoFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
        <div>
          <Link to="/todo/edit" className="btn">
            Add Todo
          </Link>
        </div>
        <h2>Todos List</h2>

        {todos.length ? <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} /> : <p>no todos to show </p>}
        <hr />
        <h2>Todos Table</h2>
        <div style={{ width: '60%', margin: 'auto' }}>
          <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
        </div>
      </section>
    </React.Fragment>
  )
}
