
export async function moverTarefaApi(taskId, columnId, position, token) {
  if (!taskId || taskId.trim() === "") {
    throw new Error("TaskId inválido");
  }

  if (!columnId || columnId.trim() === "") {
    throw new Error("ColumnId inválido");
  }

  if (!Number.isInteger(position) || position < 1) {
    throw new Error("Position inválido");
  }

  if (!token || token.trim() === "") {
    throw new Error("Token inválido");
  }

  const response = await fetch(
    `http://localhost:3000/api/tasks/${taskId}/move`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        columnId,
        position,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Falha ao buscar dados!");
  }

  return response;
}

export async function deletarTarefaApi(taskId, token) {
  if (!taskId || taskId.trim() === "") {
    throw new Error("TaskId Inválida");
  }

  if (!token || token.trim() === "") {
    throw new Error("Token invalido");
  }

  const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Falha ao deletar tarefa");
  }

  const resultado = await response.json();

  return resultado;
}

export async function editarTarefaApi(taskId, task, token) {

  if(typeof taskId !== "string" || taskId.trim() === ""){
    throw new Error("Taskid inválido")
  }

 
  if(!task || typeof task !== "object"){
    throw new Error("Dados da tarefa inválidos")
  }



  if (typeof token !== "string" || token.trim() === "") {
    throw new Error("Token inválido");
  }

  const response = await fetch(
    `http://localhost:3000/api/tasks/${taskId}/`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(task),
    },
  );

  if(!response.ok){
    throw new Error("Falha ao atualizar tarefa");
  }

  return response;
}


export async function cadastrarTarefaApi(columnId, task, token){

  if(typeof columnId !== "string" || columnId.trim() === ""){
    throw new Error("columnId invalido");
  }

  if(!task || typeof task !== "object" || Array.isArray(task)){
    throw new Error("task invalido");
  }

  if(typeof token !== "string" || token.trim() === ""){
    throw new Error("token invalido")
  }

  const response = await fetch(`http://localhost:3000/api/columns/${columnId}/tasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  })

  if(!response.ok){
    throw new Error("Falha ao cadastrar tarefa");
  }

  return response;

}