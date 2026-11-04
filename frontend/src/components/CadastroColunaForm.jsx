import { useState } from "react";


function CadastroColunaForm({ boardId, token, formularioState, onColunaCriada }) {
  const [columnName, setColumnName] = useState("");
  const [erroCadastro, setErroCadastro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErroCadastro("");
    setEnviando(true);
    let colunaCriada = false;

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

      colunaCriada = true;

      const atualizado = await onColunaCriada();

      if(!atualizado){
        throw new Error("não foi possível atualizar a lista")
      }

      formularioState(false);

    } catch (error) {

      if(colunaCriada){
        setErroCadastro("Coluna criada, mas não foi possível atualizar a lista.");
      }else{
        setErroCadastro("Erro ao cadastrar coluna");
      }

      

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

export default CadastroColunaForm;