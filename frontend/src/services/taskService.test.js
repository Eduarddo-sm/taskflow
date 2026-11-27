import { test, expect, vi, afterEach } from "vitest";
import { moverTarefaApi } from "./taskService";

test("Deve rejeitar uma posição inválida", async () => {
  //Arrange
  const taskId = "task-123";
  const columnId = "column-123";
  const position = 0;
  const token = "token-123";

  //Act + Assert
  await expect(
    moverTarefaApi(taskId, columnId, position, token),
  ).rejects.toThrow("Position inválido");
});

test("Deve rejeitar quando a API responder HTTP 400", async () => {
  //Arrange
  const fetchSimulado = vi.fn().mockResolvedValue({
    ok: false,
    status: 400,
  });

  vi.stubGlobal("fetch", fetchSimulado);

  const taskId = "task-123";
  const columnId = "column-123";
  const position = 1;
  const token = "token-test";

  //Act + Assert
  await expect(
    moverTarefaApi(taskId, columnId, position, token),
  ).rejects.toThrow("Falha ao buscar dados!");
  expect(fetchSimulado).toHaveBeenCalledOnce();
  expect(fetchSimulado).toHaveBeenCalledWith(
    `http://localhost:3000/api/tasks/${taskId}/move`,
    expect.objectContaining({
      method: "PATCH",
      headers: expect.objectContaining({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }),
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test("Deve rejeitar quando houver falha de conexão", async () => {
  //Arrange
  const taskId = "task-123";
  const columnId = "column-123";
  const position = 1;
  const token = "token-123";

  const fetchSimulado = vi
    .fn()
    .mockRejectedValue(new Error("Falha de conexão"));

  vi.stubGlobal("fetch", fetchSimulado);

  //Act + Assert
  await expect(
    moverTarefaApi(taskId, columnId, position, token),
  ).rejects.toThrow("Falha de conexão");
  expect(fetchSimulado).toHaveBeenCalledOnce();
  expect(fetchSimulado).toHaveBeenCalledWith(
    `http://localhost:3000/api/tasks/${taskId}/move`,
    expect.objectContaining({
      method: "PATCH",
      body: JSON.stringify({
        columnId: columnId,
        position: position,
      }),
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test("Deve movimentar a tarefa com sucesso", async () => {
  //Arrange
  const fetchSimulado = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
  });

  vi.stubGlobal("fetch", fetchSimulado);

  //Act
  const resultado = await moverTarefaApi(
    "task-123",
    "column-123",
    1,
    "token-test",
  );

  //Assert
  expect(resultado.ok).toBe(true);
  expect(fetchSimulado).toHaveBeenCalledOnce();
  //console.log(fetchSimulado.mock.calls);

  //ANALISE DO BODY//a
  //  Arrange
  const opcoes = fetchSimulado.mock.calls[0][1];

  //Act
  const body = JSON.parse(opcoes.body);

  //Assert

  expect(body).toEqual({
    columnId: "column-123",
    position: 1,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

export function atualizarPrioridade(tarefas, taskId, novaPrioridade) {
  const resultado = tarefas.map((tarefa) =>
    tarefa.taskId === taskId ? { ...tarefa, priority: novaPrioridade } : tarefa,
  );

  return resultado;
}

test("Teste de atualizao com spread operador e map", () => {
  //Arrange
  const tarefas = [
    { taskId: "1", title: "Criar API", priority: "HIGH" },
    { taskId: "2", title: "Criar frontend", priority: "HIGH" },
    { taskId: "3", title: "Testar sistema", priority: "MEDIUM" },
  ];
  const taskId = 999;
  const novaPrioridade = "LOW";

  //Act
  const resultado = atualizarPrioridade(tarefas, taskId, novaPrioridade);

  //Assert

  //Verificar se o array original não foi modificado
  expect(tarefas[1].priority).toBe("HIGH");

  //Verificar se o map crionou um novo array
  expect(resultado).not.toBe(tarefas);

  //Verificar se a tarefa modificado é um novo objeto
  //expect(resultado[1]).not.toBe(tarefas[1]);

  //Verificar se o array retornado possui o mesmo conteudo do original
  expect(resultado[taskId]).toEqual(tarefas[taskId]);

  //Verificar se o array retornado é uma nova referencia
  expect(resultado[taskId]).not.toBe(tarefas);
});


test("Teste de consulta de Api", async () => {
 
    //Arrange
    const fetchSimulado = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
            boardId: "board-123",
            columns: []
        })
    })

    const response = await fetchSimulado();
    const dados = await response.json();

    expect(response.status).toBe(200)
    expect(dados).toEqual({
        boardId: "board-123",
        columns: []
    })
    expect (response.json).toHaveBeenCalledOnce()

});
