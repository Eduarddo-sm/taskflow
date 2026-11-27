import { test, expect, vi, afterEach } from "vitest";
import { boardService } from "./boardService.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

test("BoardService retorno de dados de um board", async () => {
  //Arrange
  const boardId = "board-123";
  const token = "token-123";
  const boardSimulado = {
    boardId: "board-123",
    boardName: "board-test",
    columns: [
      {
        boardId: "board-123",
        columnId: "column-123",
        columnName: "test",
        position: 1,
        tasks: [],
      },
    ],
  };

  const jsonSimulado = vi.fn().mockResolvedValue(boardSimulado);
  const fetchSimulado = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: jsonSimulado,
  });

  vi.stubGlobal("fetch", fetchSimulado);

  //Act
  const dados = await boardService(boardId, token);

  //Assert
  expect(fetchSimulado).toHaveBeenCalled();
  expect(jsonSimulado).toHaveBeenCalledOnce();
  expect(dados).toEqual(boardSimulado);
});

test("Lançar erro quando o board não for encontrado", async () => {
  //Arrange
  const boardId = "board-inexistente";
  const token = "token-123";

  const jsonSimulado = vi.fn();

  const fetchSimulado = vi.fn().mockResolvedValue({
    ok: false,
    status: 404,
    json: jsonSimulado,
  });

  vi.stubGlobal("fetch", fetchSimulado);

  //Act Assert

  await expect(boardService(boardId, token)).rejects.toThrow(
    "Falha ao buscar boards",
  );
  expect(jsonSimulado).not.toHaveBeenCalled();
  expect(fetchSimulado).toHaveBeenCalledOnce();
});

test("json inválido", async () => {
  const jsonSimulado = vi
    .fn()
    .mockRejectedValue(new SyntaxError("JSON inválido"));

  const fetchSimulado = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: jsonSimulado,
  });

  vi.stubGlobal("fetch", fetchSimulado);

  await expect(boardService("taskId", "token-123")).rejects.toThrow(
    "JSON inválido",
  );
  expect(fetchSimulado).toHaveBeenCalledOnce();
  expect(jsonSimulado).toHaveBeenCalledOnce();
});

test("Lançar erro quando houver falha de conexão", async () => {
  //Arrange
  const boardId = "board-123";
  const token = "token-123";

  const fetchSimulado = vi
    .fn()
    .mockRejectedValue(new Error("Falha de conexão"));

  vi.stubGlobal("fetch", fetchSimulado);

  // Act + Assert
  await expect(boardService(boardId, token)).rejects.toThrow(
    "Falha de conexão",
  );
  expect(fetchSimulado).toHaveBeenCalledOnce();
});

test("Verificar parâmetros da requisição", async () => {
  //Arrange
  const boardId = "boardId-123";
  const token = "token-123";

  const fetchSimulado = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: vi.fn().mockResolvedValue({})
  });

  vi.stubGlobal("fetch", fetchSimulado);

  //Act 
  await boardService(boardId, token); 
  
  //Assert
  expect(fetchSimulado).toHaveBeenCalledOnce();
  expect(fetchSimulado).toHaveBeenCalledWith(
    `http://localhost:3000/api/boards/${boardId}/`,
    expect.objectContaining({
      method: "GET",
      headers: expect.objectContaining({
        Authorization: `Bearer ${token}`,
      }),
    }),
  );
});


function funcaoA(){
  return 10;
}

async function funcaoB(){
  return 10
}

test("treino", async()=>{

const resultadoA = vi.fn().mockReturnValue(10);
const resultadoB = vi.fn().mockResolvedValue(10);


expect(resultadoA()).toBe(10);
await expect(resultadoB()).resolves.toBe(10);
//await expect(resultadoA()).resolves.toBe(10);

})


test("Deve rejeitar quando o BoardId for inválido", async()=>{


  //Arrange
  const boardId = "";
  const token = "token-123";

  const fetchSimulado = vi.fn();

  vi.stubGlobal("fetch", fetchSimulado);

  //Act + Assert
  await(boardService(boardId, token)).rejects.toBe("BoardId inválido");
  expect(fetchSimulado).not.toHaveBeenCalled();

})