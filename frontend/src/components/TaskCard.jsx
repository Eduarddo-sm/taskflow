import { useState } from "react";
import "./taskCard.css";
import EditarTarefa from "./EditarTarefa.jsx";
import DeletarTarefa from "./DeletarTarefa.jsx";

function resolveDate(date) {
  if(date === null){
    return null
  }

  const [newDate, hours] = date.split(" ");

  return newDate;
}

function TaskCard({ columnId, task, token, onTarefaCriada, colunasDisponiveis }) {
  const [mostrarEditarTarefas, setMostrarEditarTarefas] = useState(false);
  const [mostrarDeletarTarefa, setMostrarDeletarTarefa] = useState(false);

  function handleDragStart(event){
    event.dataTransfer.setData("text/plain", task.taskId);
  }


  const newDate = resolveDate(task.dueDate);
  return (
    <>
      <div className="card" draggable={true} onDragStart={handleDragStart}>
        <div className="description">
          <p>{task.title}</p>
          <p>{newDate}</p>
        </div>
        <div className="editar" onClick={() => setMostrarEditarTarefas(true)}>
          Editar
        </div>
        <div className="deletar" onClick={() => setMostrarDeletarTarefa(true)}>
          Deletar
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

      {mostrarDeletarTarefa && (
        <DeletarTarefa
          task={task}
          token={token}
          onTarefaDeletada={onTarefaCriada}
          onCancelar={()=> setMostrarDeletarTarefa(false)}
        />
      )

      }
    </>
  );
}

export default TaskCard;
