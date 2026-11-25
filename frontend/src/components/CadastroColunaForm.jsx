import { useState } from "react";
import { criarColuna } from "../services/columnService.js";


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
      
      const response = await criarColuna(columnName, boardId, token);

      colunaCriada = true;

      const atualizado = await onColunaCriada(false);

      if(!atualizado){
        throw new Error("não foi possível atualizar a lista")
      }

      formularioState(false);

    } catch (error) {
      console.log(error)

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