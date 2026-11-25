


export async function criarColuna(columnName, boardId, token){

  if(typeof columnName !== "string" || columnName.trim() === ""){
      console.log("ColumnName invalido")
      throw new Error("Nome de coluna invalido!");
  }

  if(typeof token !== "string" || token.trim() === ""){
      console.log("Token invalido")
      throw new Error("Token inválido!");
  }

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
    throw new Error("Falha ao cadastrar coluna!");
  }

  return response;
}