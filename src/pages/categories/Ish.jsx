import React from 'react'
import { useTodo } from "../../context/TodoContext";

function Ish() {
  const { todos, addTodo, toggleTodo } = useTodo();
  const ishTodos = todos.filter(t => t.category === "Ish");

  return (
    <div>Ish</div>
  )
}

export default Ish