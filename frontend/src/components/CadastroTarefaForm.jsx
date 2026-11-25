import { useState } from "react";
import "./CadastroTarefaForm.css";
import { cadastrarTarefaApi } from "../services/taskService";

function CadastroTarefaForm({ columnId, token, onTarefaCriada, onCancelar }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [date, setDate] = useState("");
  const [erroCadastro, setErroCadastro] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setErroCadastro("");
    let tarefaCriada = false;
    const dadosTarefa = {
      title: title.trim(),
      priority,
      description: description.trim() === "" ? null : description.trim(),
      dueDate: date === "" ? null : date,
    };
    const priorities = ["LOW", "MEDIUM", "HIGH"];

    if (typeof title !== "string" || title.trim() === "") {
      setErroCadastro("O titulo é obrigatorio!");
      return;
    }

    if (!priorities.includes(priority)) {
      setErroCadastro("A prioridade é obrigatório");
      return;
    }

    try {
      const response = await cadastrarTarefaApi(columnId, dadosTarefa, token);

      tarefaCriada = true;

      const atualizado = await onTarefaCriada();

      if (!atualizado) {
        throw new Error("Falha ao atualizar coluna");
      }

      onCancelar();
    } catch (error) {
      if (tarefaCriada) {
        setErroCadastro(
          "Tarefa criada, mas não foi possível atualizar a lista.",
        );
      } else {
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
        ></textarea>

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
