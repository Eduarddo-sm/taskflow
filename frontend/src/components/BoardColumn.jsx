import { useState } from "react";
import CadastroTarefaForm from "./CadastroTarefaForm.jsx";
import TaskCard from "./TaskCard.jsx";

function BoardColumn({ columnId, columnName, tasks, token, onTarefaCriada }) {

    const [ mostrarFormularioTarefa, setMostrarFormularioTarefa ] = useState(false);
    return (
    <>
    <div className={`column`}>
        <p>{columnName}</p>
    
        <div className="tasks">
            {tasks.map((task) => (
              <TaskCard 
                key={task.taskId}
                columnId={columnId}
                task={task}
                token={token}
                onTarefaCriada={onTarefaCriada}              
              />

            ))}
        </div>
        <button type="button" onClick={ () => setMostrarFormularioTarefa(true) }>Add task</button>
    </div>

    {mostrarFormularioTarefa && (
      <CadastroTarefaForm 
        columnId={columnId}
        token={token}
        onTarefaCriada={onTarefaCriada}
        onCancelar={() => setMostrarFormularioTarefa(false)}
      />
    )}
  </>
  )
}

export default BoardColumn;
