import { useState } from "react";
import CadastroTarefaForm from "./CadastroTarefaForm.jsx";

function BoardColumn({ columnId, columnName, tasks, token, onTarefaCriada }) {

    const [ mostrarFormularioTarefa, setMostrarFormularioTarefa ] = useState(false);

    return (
    <>
    <div className={`column`}>
        <p>{columnName}</p>
    
        <div className="tasks">
            {tasks.map((task) => (
              <div key={task.taskId} className="task">
                <p>{task.title}</p>
              </div>
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
