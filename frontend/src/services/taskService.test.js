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

  //ANALISE DO BODY//
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


test("Deve criar uma cópia independente do objeto", () => {
  // Arrange
  const objetoA = { numero: 10 };
  const objetoB = {...objetoA};

  // Assert
  expect(objetoA).toBe(objetoB);
  expect(objetoA).toEqual(objetoB);
});