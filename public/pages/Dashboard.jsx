const { useEffect, useState } = React
const { useSelector } = ReactRedux
import { Chart } from '../cmps/Chart.jsx'
import { todoService } from '../services/todo.service.js'
import { loadTodos } from '../store/actions/todo.actions.js'

export function Dashboard() {
  const todos = useSelector(storeState => storeState.todoModule.todos)
  const [priorityStats, setPriorityStats] = useState([])

  useEffect(() => {
    loadTodos()
    todoService.getPriorityStats().then(setPriorityStats)
  }, [])

  return (
    <section className="dashboard">
      <h1>Dashboard</h1>
      <h2>Statistics for {todos.length} Todos</h2>
      <hr />
      <h4>By Priority</h4>
      <Chart data={priorityStats} />
    </section>
  )
}
