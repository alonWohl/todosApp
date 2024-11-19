import { utilService } from '../services/util.service.js'

const { useState, useEffect, useRef } = React

export function TodoFilter({ filterBy, onSetFilterBy }) {
  const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })

  onSetFilterBy = useRef(utilService.debounce(onSetFilterBy), 500).current

  useEffect(() => {
    onSetFilterBy(filterByToEdit)
  }, [filterByToEdit])

  function handleChange({ target }) {
    const field = target.name
    let value = target.value

    switch (target.type) {
      case 'number':
      case 'range':
        value = +value || ''
        break

      case 'checkbox':
        value = target.checked
        break

      default:
        break
    }

    setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
  }

  function onSubmitFilter(ev) {
    ev.preventDefault()
    onSetFilterBy(filterByToEdit)
  }

  const { txt, importance } = filterByToEdit
  return (
    <section className="todo-filter">
      <h2>Filter Todos</h2>
      <form onSubmit={onSubmitFilter}>
        <input value={txt} onChange={handleChange} type="search" placeholder="By Txt" id="txt" name="txt" />
        <label htmlFor="importance">Importance: </label>
        <input value={importance} onChange={handleChange} type="number" placeholder="By Importance" id="importance" name="importance" />

        <label htmlFor="select">Show</label>
        <select onChange={handleChange} name="select" id="select">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="done">Done</option>
        </select>

        <button hidden>Set Filter</button>
      </form>
    </section>
  )
}
