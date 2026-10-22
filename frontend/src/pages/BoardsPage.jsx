import { useState, useEffect } from "react";
import BoardPage from "./BoardPage.jsx";

function BoardsPage({ token }) {
  const [boards, setBoards] = useState([]);
  const [boardSelecionado, setBoardSelecionado] = useState(null);

  async function buscarBoards() {
    try {
      const response = await fetch("http://localhost:3000/api/boards/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao buscar dados");
      }

      const dados = await response.json();

      setBoards(dados);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    buscarBoards();
  }, [token]);

  function handleVoltar(){
    setBoardSelecionado(null)
  }
  

  return (
    <>
      {boardSelecionado ? (
        <BoardPage boardId={boardSelecionado} token={token} onVoltar={handleVoltar} />
      ) : (
        <>
          <h1>Bem vindo</h1>
          {boards.map((item) => (
            <div key={item.boardId}>
              <p>{item.board.boardName}</p>
              <button onClick={() => setBoardSelecionado(item.boardId)}>
                Selecionar
              </button>
            </div>
          ))}
        </>
      )}
    </>
  );
}

export default BoardsPage;
