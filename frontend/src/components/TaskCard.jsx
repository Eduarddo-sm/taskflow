import { useState } from "react";
import "./taskCard.css";
import EditarTarefa from "./EditarTarefa.jsx";

function resolveDate(date) {
  const [newDate, hours] = date.split(" ");
  return newDate;
}

function TaskCard({ columnId, task, token, onTarefaCriada }) {
  const [mostrarEditarTarefas, setMostrarEditarTarefas] = useState(false);
  const newDate = resolveDate(task.dueDate);

  return (
    <>
      <div className="card">
        <div className="description">
          <p>{task.title}</p>
          <p>{newDate}</p>
        </div>
        <div className="icon" onClick={() => setMostrarEditarTarefas(true)}>
          Editar
        </div>
      </div>

      {mostrarEditarTarefas && (
        <EditarTarefa
          task={task}
          token={token}
          columnId={columnId}
          onTarefaCriada={onTarefaCriada}
          onCancelar={()=> setMostrarEditarTarefas(false)}
        />
      )}
    </>
  );
}

export default TaskCard;
