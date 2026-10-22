import { useEffect, useState } from "react";
import "./BoardPage.css";

function CadastroColunaForm({ boardId, token, formularioState, onColunaCriada }) {
  const [columnName, setColumnName] = useState("");
  const [erroCadastro, setErroCadastro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErroCadastro("");
    setEnviando(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/boards/${boardId}/columns`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ columnName }),
        },
      );

      if (!response.ok) {
        throw new Error("Falha ao criar coluna");
      }

      await onColunaCriada();
      formularioState(false);

    } catch (error) {
      setErroCadastro(error.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="formularioCadastrarColuna">
      <form onSubmit={handleSubmit}>
        <label htmlFor="columnName">Nome da Coluna</label>
        <input
          type="text"
          id="columnName"
          value={columnName}
          onChange={(event) => setColumnName(event.target.value)}
        />
        <button type="submit" disabled={enviando}>{enviando ? "Criando...": "Criar"}</button>
        <button type="button" onClick={() => formularioState(false)}>Cancelar</button>
        {erroCadastro && (
          <p>{erroCadastro}</p>
        )}
      </form>
    </div>
  );
}

function BoardPage({ boardId, token, onVoltar }) {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  function handleVoltar() {
    onVoltar();
  }

  async function getColumns() {
    setLoading(true);
    setErro("");

    try {
      const response = await fetch(
        `http://localhost:3000/api/boards/${boardId}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Falha ao buscar dados");
      }

      const dados = await response.json();
      setColumns(dados.columns);
    } catch (error) {
      console.log(error);
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getColumns();
  }, [token, boardId]);

  return (
    <div className="">
      <h1>Meu board</h1>
      <p>{boardId}</p>

      <button onClick={handleVoltar}>Voltar</button>

      {loading ? (
        <p>Loading</p>
      ) : erro ? (
        <p>{erro}</p>
      ) : (
        <div className="boardColumns">
          {columns.length === 0 ? (
            <p>Sem colunas</p>
          ) : (
            columns.map((item) => (
              <div key={item.columnId} className="column">
                <p>{item.columnName}</p>

                <div className="tasks">
                  {item.tasks.map((task) => (
                    <div key={task.taskId} className="task">
                      <p>{task.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
          <button type="button" onClick={() => setMostrarFormulario(true)}>
            +
          </button>
        </div>
      )}

      {mostrarFormulario && (
        <CadastroColunaForm
          boardId={boardId}
          token={token}
          formularioState={setMostrarFormulario}
          onColunaCriada={getColumns}
        />
      )}
    </div>
  );
}

export default BoardPage;
