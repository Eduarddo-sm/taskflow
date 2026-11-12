import { useState } from "react";
import "./taskCard.css";
import EditarTarefa from "./EditarTarefa.jsx";
import DeletarTarefa from "./DeletarTarefa.jsx";

function resolveDate(date) {
  if (date === null) {
    return null;
  }

  const [newDate, hours] = date.split(" ");

  return newDate;
}

function TaskCard({columnId, task, token, onTarefaCriada, colunasDisponiveis}) {

  const [mostrarEditarTarefas, setMostrarEditarTarefas] = useState(false);
  const [mostrarDeletarTarefa, setMostrarDeletarTarefa] = useState(false);
  const [exibirErro, setExibirErro] = useState("");

  function handleDragStart(event) {
    const dataTask = {
      taskId: task.taskId,
      position: task.position,
      columnId: task.columnId,
    };

    event.dataTransfer.setData("text/plain", JSON.stringify(dataTask));
  }

  function onDragOver(event) {
    event.preventDefault();
  }

  async function handleDropSobreCard(event) {
    event.preventDefault();
    event.stopPropagation();
    let tarefaMovida = false;
    setExibirErro("");

    const dados = event.dataTransfer.getData("text/plain");

    const taskArrastada = JSON.parse(dados);
    const taskIdDestino = task.taskId;
    //Acho que não será mais necessário
    const posicaoOriginal = taskArrastada.position;
    const posicaoReferencia = task.position;

    const mesmaColuna = taskArrastada.columnId === columnId;
    let novaPosicao = 0;

    if (taskArrastada.taskId === taskIdDestino) {
      return;
    }

    if (mesmaColuna) {
        novaPosicao = posicaoReferencia;
    }

    if (!mesmaColuna) {
      novaPosicao = posicaoReferencia;
    }

    console.log("Nova posição:", novaPosicao);

    try {
      const response = await fetch(
        `http://localhost:3000/api/tasks/${taskArrastada.taskId}/move`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            columnId: columnId,
            position: novaPosicao,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Falha ao mudar a tarefa");
      }

      tarefaMovida = true;

      const atualizado = await onTarefaCriada();

      if (!atualizado) {
        throw new Error("Falha ao atualizar colunas");
      }
    } catch (error) {
      if (tarefaMovida) {
        setExibirErro(
          "Tarefas atualizas, mas não foi possivel atualizar colunas",
        );
      } else {
        setExibirErro("Não foi possível atualizar tarefas");
      }
    }
  }

  const newDate = resolveDate(task.dueDate);
  return (
    <>
      <div
        className="card"
        draggable={true}
        onDragStart={handleDragStart}
        onDragOver={onDragOver}
        onDrop={handleDropSobreCard}
      >
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
          onCancelar={() => setMostrarEditarTarefas(false)}
        />
      )}

      {mostrarDeletarTarefa && (
        <DeletarTarefa
          task={task}
          token={token}
          onTarefaDeletada={onTarefaCriada}
          onCancelar={() => setMostrarDeletarTarefa(false)}
        />
      )}
      {exibirErro && <p>{exibirErro}</p>}
    </>
  );
}

export default TaskCard;
