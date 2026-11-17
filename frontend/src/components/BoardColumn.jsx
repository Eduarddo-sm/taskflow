import { useState, useRef } from "react";
import CadastroTarefaForm from "./CadastroTarefaForm.jsx";
import TaskCard from "./TaskCard.jsx";
import "./boardColumn.css";

function BoardColumn({
  columnId,
  columnName,
  tasks,
  token,
  onTarefaCriada,
  colunasDisponiveis,
  onMoverTarefa,
}) {
  const [exibirErro, setExibirErro] = useState("");
  const [colunaDestacada, setColunaDestacada] = useState(false);
  const contadorDrag = useRef(0);

  function handleDragOver(event) {
    event.preventDefault();
    setColunaDestacada(true);
  }

  async function handleDrop(event) {
    event.preventDefault();
    setExibirErro("");

    try {
      const dados = JSON.parse(event.dataTransfer.getData("text/plain"));
      const taskId = dados.taskId;
      
      const resultado = await onMoverTarefa(taskId, columnId, 1); 

      if (!resultado.movida) {
        throw new Error("Falha ao mover tarefa");
      }

      if (!resultado.atualizada) {
        throw new Error("Tarefa movida, falha ao atualizar colunas");
      }


    } catch (error) {
      setExibirErro(error.message);
    }
  }

  function handleDragLeave(event) {
    event.preventDefault();


    contadorDrag.current = Math.max(0, contadorDrag.current -1);
    if(contadorDrag.current === 0){
      setColunaDestacada(false);
    }
  }

  function handleDropCapture(){

    contadorDrag.current = 0;
    setColunaDestacada(false)

  }

  function handleDragEnter(event){
    event.preventDefault();

    contadorDrag.current += 1;
    setColunaDestacada(true);
  }

  const [mostrarFormularioTarefa, setMostrarFormularioTarefa] = useState(false);
  return (
    <>
      <div
        className={`column ${colunaDestacada ? "destacado" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDropCapture={handleDropCapture}
        onDragEnter={handleDragEnter}
        onDrop={handleDrop}
      >
        <p>{columnName}</p>

        <div className="tasks">
          {tasks.map((task) => (
            <TaskCard
              key={task.taskId}
              columnId={columnId}
              task={task}
              token={token}
              onTarefaCriada={onTarefaCriada}
              colunasDisponiveis={colunasDisponiveis}
              onMoverTarefa={onMoverTarefa}
            />
          ))}
        </div>
        <button type="button" onClick={() => setMostrarFormularioTarefa(true)}>
          Add task
        </button>
      </div>

      {mostrarFormularioTarefa && (
        <CadastroTarefaForm
          columnId={columnId}
          token={token}
          onTarefaCriada={onTarefaCriada}
          onCancelar={() => setMostrarFormularioTarefa(false)}
        />
      )}
      {exibirErro && <p>{exibirErro}</p>}
    </>
  );
}

export default BoardColumn;
