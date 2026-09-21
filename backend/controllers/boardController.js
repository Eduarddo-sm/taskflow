import { createNewBoard, getBoardsByUser, selectBoardById, updateBoardById } from "../services/boardService.js";


export async function listBoards(req, res){
    const userId = req.user.id;

    try {

        const boards = await getBoardsByUser(userId);
        return res.status(200).json(boards);

    } catch(error){
        return res.status(500).json({
            error: "Erro ao buscar os boards"
        });
    }
}

export async function selectBoard(req, res){
    const boardId = req.params.boardId;
    const userId = req.user.id;

    if(!boardId || boardId.trim() === ""){
        return res.status(400).json({
            error: "O board solicitado não possui um código válido"
        });
    }

    try {

        const board = await selectBoardById(boardId, userId);

        return res.status(200).json(board);

    } catch (error){
        if(error === "BOARD_ACCESS_DENIED"){
           return res.status(403).json("Você não possui acesso a esse board")
        }
        res.status(500).json({
            error: "Erro ao buscar as informações do board solicitado"
        })
    }

}

export async function createBoard(req, res){

    const { boardName } = req.body;
    const ownerId = req.user.id;

    if(!boardName || boardName.trim() === ""){
        return res.status(400).json(
            {error: "Nome do board inválido"}
        );
    }

    try {

        const board = await createNewBoard(boardName, ownerId);
        return res.status(201).json(board)

    } catch (error) {
        return res.status(500).json(
            {error: "Falha ao criar o board: ", error}
        )
    }
}

export async function updateBoard(req, res){
    const { boardName } = req.body;
    const {boardId} = req.params
    const userId = req.user.id;

    if (!boardName || boardName.trim() === ""){
        return res.status(400).json({
            error: "Nome do board inválido"
        });
    }
 
    try {

        const updatedBoard = await updateBoardById(boardId, userId, boardName.trim())

        return res.status(200).json(updatedBoard);

    } catch (error) {

        if(error.message === "BOARD_NOT_EXIST"){
            return res.status(404).json({
                error: "O board não existe"
            });
        }

        if(error.message === "USER_NOT_ALLOWED"){
            return res.status(403).json({
                error: "Usuário sem permissão para acessar ou editar o board"
            });
        }

        return res.status(500).json({
            message: "Erro ao atualizar o board"
        })
    }

}


