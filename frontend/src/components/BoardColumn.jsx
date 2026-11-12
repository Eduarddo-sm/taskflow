import { useState } from "react";
import CadastroTarefaForm from "./CadastroTarefaForm.jsx";
import TaskCard from "./TaskCard.jsx";

function BoardColumn({
  columnId,
  columnName,
  tasks,
  token,
  onTarefaCriada,
  colunasDisponiveis,
}) {
  const [exibirErro, setExibirErro] = useState("");

  function handleDragOver(event) {
    event.preventDefault();
  }

  async function handleDrop(event) {
    event.preventDefault();
    setExibirErro("");
    let tarefaMovida = false;

    const dados = JSON.parse(event.dataTransfer.getData("text/plain"));
    const taskId = dados.taskId;

    try {
      const response = await fetch(
        `http://localhost:3000/api/tasks/${taskId}/move`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            columnId: columnId,
            position: 1,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Falha ao mover tarefa");
      }

      tarefaMovida = true;

      const atualizado = await onTarefaCriada();

      if (!atualizado) {
        throw new Error("Tarefa movida, falha ao atualizar colunas");
      }
    } catch (error) {
      if (tarefaMovida) {
        setExibirErro("Tarefa movida, falha ao atualizar colunas");
      } else {
        setExibirErro("Falha ao mover tarefa");
      }
    }
  }

  const [mostrarFormularioTarefa, setMostrarFormularioTarefa] = useState(false);
  return (
    <>
      <div className={`column`} onDragOver={handleDragOver} onDrop={handleDrop}>
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
