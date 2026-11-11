import { useState } from "react";
import "./editarTarefa.css";

function EditarTarefa({task, token, onTarefaCriada, onCancelar}) {
  const [title, setTitle] = useState(task.title ?? "");
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.slice(0, 10): "");
  const [erroEditar, setErroEditar] = useState("");
  const [enviando, setEnviando] = useState(false);


  async function handleSubmit(event) {
    event.preventDefault();
    setErroEditar("");
    let tarefaAtualizada = false;
    setEnviando(true)

    try {

      const response = await fetch(`http://localhost:3000/api/tasks/${task.taskId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          "title": title || undefined,
          "description": description.trim() === "" ? null : description,
          "priority": priority || undefined,
          "dueDate": dueDate.trim() === "" ? null : dueDate.trim(),
        })
      })

    if(!response.ok){
        throw new Error("Erro ao atualizar dados");
      }

    tarefaAtualizada = true;

    const atualizado = await onTarefaCriada()

    if(!atualizado){
      throw new Error("Tarefa editada, mas não foi possível atualizar a lista");
    }

    onCancelar();

    }catch(error){
      if(tarefaAtualizada){
        setErroEditar("Tarefa atualizada mas não foi possível atualizar as colunas");
      }else{
        setErroEditar("Não foi possivel atualizar a tarefa.");
      }

      

    } finally {
      setEnviando(false);
    }
  }


  return (
    <>
      <div className="editarTarefa">
        <form onSubmit={handleSubmit}>

          <label htmlFor="title">Titulo</label>
          <input type="text"
             id="title"
             value={title}
             onChange={(event) => setTitle(event.target.value)}
          />

          <label htmlFor="description">Descrição</label>
          <input 
            type="text"
            id="description" 
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <label htmlFor="priority">Prioridade</label>
          <select 
            id="priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            <option value="">Prioridades</option>
            <option value="LOW">Baixo</option>
            <option value="MEDIUM">Média</option>
            <option value="HIGH">Alto</option>
          </select>

          <label htmlFor="dueDate">Prazo</label>
          <input 
            type="date" 
            id="dueDate" 
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />

          <button type="submit" disabled={enviando}>{enviando ? "atualizando...":"atualzar"}</button>
          <button type="button" onClick={onCancelar}>Cancelar</button>
        </form>
        {erroEditar && <p>{erroEditar}</p>}
      </div>
    </>
  );
}

export default EditarTarefa;
