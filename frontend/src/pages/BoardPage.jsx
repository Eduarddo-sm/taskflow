

function BoardPage({boardId, token, onVoltar}){

    function handleVoltar(){
        onVoltar(null)
    }

    return(
        <>
            <h1>Meu board</h1>
            <p>{boardId}</p>

            <button onClick={handleVoltar}>Voltar</button>
        </>
    )
}

export default BoardPage;