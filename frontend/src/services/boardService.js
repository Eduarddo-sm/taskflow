export async function boardService(boardId, token) {
  if (!boardId || boardId.trim() === "") {
    throw new Error("BoardId inválido");
  }

  if (!token || token.trim() === "") {
    throw new Error("Token inválido");
  }

  const response = await fetch(`http://localhost:3000/api/boards/${boardId}/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Falha ao buscar boards");
  }

  const dados =  response.json();

  return dados;
}
