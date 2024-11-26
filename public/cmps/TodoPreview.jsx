export function TodoPreview({ todo, onToggleTodo }) {
  return (
    <article className="todo-preview">
      <h2 className={todo.isDone ? 'done' : ''} onClick={onToggleTodo}>
        Todo: {todo.txt}
      </h2>
      <h4>Todo Priority: {todo.priority}</h4>
      <img src={`../assets/img/${'todo'}.png`} alt="" />
    </article>
  )
}
