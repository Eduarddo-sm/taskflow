import { useState } from "react";
import "./deletarTarefa.css"

function DeletarTarefa({task, token, onTarefaDeletada, onCancelar}){
    const [exibirErro, setExibirErro] = useState("");
    const [excluindo, setExcluindo] = useState(false);

    async function deleteHandle(event) {
        event.preventDefault();
        setExibirErro("");
        setExcluindo(true);

        let tarefaRemovida = false;

        try{
            const response = await fetch(`http://localhost:3000/api/tasks/${task.taskId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok){
            throw new Error("Falha ao deletar")
        }

        tarefaRemovida = true;
        const atualizada = await onTarefaDeletada()

        if(!atualizada){
            throw new Error("Tarefa removida, mas falha ao atualizar.")
        }

        onCancelar()

        }catch(error){
            if(tarefaRemovida){
                setExibirErro("Tarefa removida mas não foi possivel atualizar as tarefas");
            }else{
                setExibirErro("Não foi possível remoer a tarefa");
            }
        } finally {
            setExcluindo(false);
        }

    }

    return (
        <>
            <div className="deletarTarefa">
                <form onSubmit={deleteHandle}>
                    <button disabled={excluindo}>{excluindo ? "Excluindo...":"Excluir"}</button>
                    <button type="button" onClick={onCancelar}>Canclear</button>
                </form>
               {exibirErro && <p role="alert">{exibirErro}</p>}
            </div>
        </>
    )
}


export default DeletarTarefa;