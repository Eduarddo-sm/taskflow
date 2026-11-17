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

function TaskCard({columnId, task, token, onTarefaCriada, onMoverTarefa}) {

  const [mostrarEditarTarefas, setMostrarEditarTarefas] = useState(false);
  const [mostrarDeletarTarefa, setMostrarDeletarTarefa] = useState(false);
  const [arrastando, setArrastando] = useState(false);
  const [exibirErro, setExibirErro] = useState("");

  function handleDragStart(event) {
    const dataTask = {
      taskId: task.taskId,
      position: task.position,
      columnId: task.columnId,
    };

    setArrastando(true);

    event.dataTransfer.setData("text/plain", JSON.stringify(dataTask));
  }

  function onDragOver(event) {
    event.preventDefault();
  }

  async function handleDropSobreCard(event) {
    event.preventDefault();
    event.stopPropagation();
    setExibirErro("");

    const dados = event.dataTransfer.getData("text/plain");

    const taskArrastada = JSON.parse(dados);
    const taskIdDestino = task.taskId;
    //Acho que não será mais necessário, recalculo feito na propria API
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
    
    try {
      const resultado = await onMoverTarefa(taskArrastada.taskId, columnId, novaPosicao);

      if (!resultado.movida) {
        throw new Error("Falha ao mover as tarefas");
      }

      if (!resultado.atualizada) {
        throw new Error("Falha ao atualizar dados");
      }
    } catch (error) {
        setExibirErro(error.message)
    }
  }

  function handleDragEnd(){
    setArrastando(false);
  }

  const newDate = resolveDate(task.dueDate);
  return (
    <>
      <div
        className={`card ${arrastando ? "arrastando": ""}`}
        draggable={true}
        onDragStart={handleDragStart}
        onDragOver={onDragOver}
        onDrop={handleDropSobreCard}
        onDragEnd={handleDragEnd}
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
