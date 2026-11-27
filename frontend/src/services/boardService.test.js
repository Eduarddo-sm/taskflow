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


test("Lançar erro quando o board não for encontrado", async ()=>{

    //Arrange
    const boardId = "board-inexistente";
    const token = "token-123";

    const jsonSimulado = vi.fn();

    const fetchSimulado = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: jsonSimulado
    });

    vi.stubGlobal("fetch", fetchSimulado);

    //Act Assert

    await expect(boardService(boardId, token)).rejects.toThrow("Falha ao buscar boards");
    expect(jsonSimulado).not.toHaveBeenCalled();
    expect(fetchSimulado).toHaveBeenCalledOnce();

})


test("json inválido", async()=>{

    const jsonSimulado = vi.fn().mockRejectedValue(
        new SyntaxError("JSON inválido")
    );

    const fetchSimulado = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: jsonSimulado
    });

    vi.stubGlobal("fetch", fetchSimulado);

    await expect(boardService("taskId", "token-123")).rejects.toThrow("JSON inválido");
    expect(fetchSimulado).toHaveBeenCalledOnce();
    expect(jsonSimulado).toHaveBeenCalledOnce();

})
