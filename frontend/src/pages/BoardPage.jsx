import { useEffect, useState } from "react";
import CadastroColunaForm from "../components/CadastroColunaForm.jsx";
import BoardColumn from "../components/BoardColumn.jsx";
import "./BoardPage.css";
import { moverTarefaApi } from "../services/taskService.js";
import { boardService } from "../services/boardService.js";

function BoardPage({ boardId, token, onVoltar }) {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [erroAtualizacao, setErroAtualizacao] = useState("");

  async function getColumns(exibirLoading = true) {
    setLoading(exibirLoading);
    setErro("");
    setErroAtualizacao("");

    try {
      const response = await boardService(boardId, token);
      setColumns(response.columns);
      console.log(response)
      return true;
    } catch (error) {
      if (exibirLoading) {
        setErro(error.message);
      } else {
        setErroAtualizacao("Erro na atualização de dados");
      }

      return false;
    } finally {
      setLoading(false);
    }
  }

  async function moverTarefa(taskId, columnId, position) {
    let movida = false;

    try {
      await moverTarefaApi(taskId, columnId, position, token);

      movida = true;

      const atualizada = await getColumns(false);

      return { movida, atualizada };
    } catch (error) {
      console.log(error.message);

      return { movida, atualizada: false };
    }
  }

  useEffect(() => {
    getColumns();
  }, [token, boardId]);

  return (
    <div className="">
      <h1>Meu board</h1>
      <p>{boardId}</p>

      <button onClick={() => onVoltar()}>Voltar</button>

      {loading ? (
        <p>Loading</p>
      ) : erro ? (
        <p>{erro}</p>
      ) : (
        <>
          {erroAtualizacao && <p role="alert">{erroAtualizacao}</p>}
          <div className="boardColumns">
            {columns.length === 0 ? (
              <p>Sem colunas</p>
            ) : (
              columns.map((item) => (
                <BoardColumn
                  key={item.columnId}
                  columnId={item.columnId}
                  columnName={item.columnName}
                  tasks={item.tasks}
                  token={token}
                  onTarefaCriada={() => getColumns(false)}
                  colunasDisponiveis={columns}
                  onMoverTarefa={moverTarefa}
                />
              ))
            )}
            <button type="button" onClick={() => setMostrarFormulario(true)}>
              +
            </button>
          </div>
        </>
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
