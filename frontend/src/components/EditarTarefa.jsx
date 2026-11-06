import { useState } from "react";
import "./editarTarefa.css";

function EditarTarefa({columnId, task, token, onTarefaCriada, onCancelar}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate);


  async function handleSubmit(event) {
    event.preventDefault();

    try {

      const response = await fetch(`http://localhost:3000/api/tasks/${columnId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          "title": title || undefined,
          "description": description || undefined,
          "priority": priority || undefined,
          "dueDate:": dueDate || undefined,
        })
      })

      if(!response.ok){
        throw new Error("Erro ao atualizar dados");
      }

      

    }catch(error){
      console.log(error)
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

          <label htmlFor="deDate">Prazo</label>
          <input 
            type="date" 
            id="dueDate" 
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />

          <button type="submit">Atualizar</button>
          <button type="button" onClick={onCancelar}>Cancelar</button>
        </form>
      </div>
    </>
  );
}

export default EditarTarefa;
