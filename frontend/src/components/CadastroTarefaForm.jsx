import { useState } from "react";
import "./CadastroTarefaForm.css";

function CadastroTarefaForm({ columnId, token, onTarefaCriada, onCancelar }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [date, setDate] = useState("")
  const [erroCadastro, setErroCadastro] = useState("");

  
  async function handleSubmit(event) {
    event.preventDefault();
    setErroCadastro("");
    let tarefaCriada = false;
    console.log(`
        Titulo: ${title};
        Prioridade: ${priority};
        Descrição: ${description};
        Data: ${date}
        `)
    
    try {

        const response = await fetch(`http://localhost:3000/api/columns/${columnId}/tasks`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "title": title,
            "priority": priority,
            "description": description,
            "dueDate": date || undefined,
        })
        
    });


    if(!response.ok){
        throw new Error("Falha ao cadastrar tarefa");
    }

    tarefaCriada = true;

    const atualizado = await onTarefaCriada();

    if(!atualizado){
        throw new Error("Falha ao atualizar coluna")
    }


    }catch(error){

        if(tarefaCriada){
            setErroCadastro("Tarefa criada, mas não foi possível atualizar a lista.");
        }else{
            setErroCadastro("Falha ao cadastrar tarefa.");
        }

    }
  }

  return (
    <div className="cadastroTarefaForm">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />

        <label htmlFor="description">Descrição</label>
        <textarea 
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
        >

        </textarea>

        <label htmlFor="priority">Prioridade</label>
        <select 
            id="priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            required
        >
        <option value=""></option>
         <option value="LOW">Baixa</option>   
         <option value="MEDIUM">Média</option>
         <option value="HIGH">Alta</option>   
        </select>

        <label htmlFor="date">Data</label>
        <input 
            type="date"
            id="date" 
            value={date}
            onChange={(event) => setDate(event.target.value)}
        />

        <button type="submit">Criar</button>
        <button type="button" onClick={onCancelar}>
          Cancelar
        </button>
      </form>
      {erroCadastro && <p>{erroCadastro}</p>}
    </div>
  );
}

export default CadastroTarefaForm;
