import React, { useEffect, useState } from "react";

function TodoList() {
  const [taskInput, setTaskInput] = useState("");
  const [todos, setTodos] = useState([]);
  const url = "https://playground.4geeks.com/todo";
  const user = "MeliRM";

  useEffect(() => {
    getTodos();
  }, []);

  
  const getTodos = () => {
    fetch(`${url}/users/${user}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener tareas");
        return res.json();
      })
      .then((data) => setTodos(data.todos))
      .catch((err) => console.error("Error:", err));
  };

  
  const addTask = () => {
    const trimmed = taskInput.trim();
    if (!trimmed) return;

    const newTask = { label: trimmed, done: false };

    fetch(`${url}/todos/${user}`, {
      method: "POST",
      body: JSON.stringify(newTask),
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al agregar tarea");
        return res.json();
      })
      .then(() => {
        setTaskInput("");
        getTodos();
      })
      .catch((err) => console.error(err));
  };

  
  const updateTodos = (newTodos) => {
    fetch(`${url}/users/${user}/todos`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodos)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar tareas");
        return res.json();
      })
      .then(() => setTodos(newTodos))
      .catch((err) => console.error(err));
  };

  
  const deleteTask = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    updateTodos(newTodos);
  };

  return (
    <div className="todo-container">
      <h2>Lista de Tareas</h2>

      <input
        type="text"
        placeholder="Escribe una tarea y presiona Enter"
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTask()}
      />

      <ul className="task-list">
        {todos.length === 0 ? (
          <li className="no-task">No hay tareas</li>
        ) : (
          todos.map((task, index) => (
            <li key={index} className="task-item">
              {task.label}
              <span className="delete-icon" onClick={() => deleteTask(index)}>🗑️</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default TodoList;



