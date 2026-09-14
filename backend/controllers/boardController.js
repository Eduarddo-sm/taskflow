import { createNewBoard } from "../services/boardService.js";

export async function getBoard(req, res){

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
            {error: "Falha ao criar o board"}
        )
    }
}

export async function putBoard(req, res){

}

export async function deleteBoard(req, res){}