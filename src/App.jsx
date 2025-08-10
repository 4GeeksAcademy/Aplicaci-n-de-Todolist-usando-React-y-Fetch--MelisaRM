import React, { useEffect, useState } from "react";

function App() {
  const [taskInput, setTaskInput] = useState("");
  const [todos, setTodos] = useState([]);
  const url = "https://playground.4geeks.com/todo";
  const user = "MeliRM";

  useEffect(() => {
    createUserIfNotExists();
  }, []);

  
  const createUserIfNotExists = () => {
    fetch(`${url}/users/${user}`)
      .then((res) => {
        if (res.ok) return res.json();
        return fetch(`${url}/users/${user}`, {
          method: "POST",
          body: JSON.stringify([]),
          headers: { "Content-Type": "application/json" }
        }).then(() => ({ todos: [] }));
      })
      .then(() => getTodos())
      .catch((err) => console.error("Error creando usuario:", err));
  };

  
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

    const newTask = { label: trimmed, is_done: false };

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

  
  const deleteTask = (id) => {
    fetch(`${url}/todos/${id}`, {
      method: "DELETE"
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar tarea");
        getTodos();
      })
      .catch((err) => console.error(err));
  };

  
  const clearAllTasks = async () => {
    try {
      if (todos.length === 0) return;

      await Promise.all(
        todos.map((task) =>
          fetch(`${url}/todos/${task.id}`, { method: "DELETE" })
        )
      );

      setTodos([]);
      console.log("Todas las tareas eliminadas.");
    } catch (err) {
      console.error("Error al limpiar todas las tareas:", err);
    }
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

      <button onClick={clearAllTasks} style={{ margin: "10px" }}>
        Limpiar todo
      </button>

      <ul className="task-list">
        {todos.length === 0 ? (
          <li className="no-task">No hay tareas</li>
        ) : (
          todos.map((task) => (
            <li key={task.id} className="task-item">
              {task.label}
              <span
                className="delete-icon"
                onClick={() => deleteTask(task.id)}
              >
                🗑️
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
