
import { createNewColumn } from "../services/columnService.js";


export async function createColumn(req, res){

    const { columnName } = req.body;
    const {boardId} = req.params;
    const userId = req.user.id;
    
    if(!columnName || columnName.trim() === ""){
        return res.status(400).json({
            error: "Nome inválido"
        });
    }

    try{

        const createdColumn = await createNewColumn(columnName, boardId, userId);

        return res.status(200).json(createdColumn);

    }catch(error){
        return res.status(500).json({
            error: "Erro ao criar coluna", error
        });
    }
}