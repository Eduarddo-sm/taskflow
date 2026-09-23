
import { createNewColumn, updateColumnById, deleteColumnById } from "../services/columnService.js";


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

        return res.status(201).json(createdColumn);

    }catch(error){

        if(error.message === "NOT_FIND_BOARD"){
            return res.status(404).json({
                error: "Board não encontrado"
            });
        }

        if(error.message === "USER_IS_NOT_A_MEMBER"){
            return res.status(403).json({
                error: "Usuário não pertence a este board"
            })
        }

        if(error.message === "USER_DO_NOT_HAVE_PERMISSION"){
            return res.status(403).json({
                error: "Usuário não possui permissão para criar colunas"
            });
        }

        return res.status(500).json({
            error: "Erro interno ao criar coluna"
        });
    }
}

export async function updateColumn(req, res){

    const {columnName} = req.body;
    const userId = req.user.id;
    const {columnId} = req.params;

    if(!columnName || columnName.trim() === ""){
        return res.status(400).json({
            error: "Nome inválido"
        });
    }

    try {

        const updatedColumn = await updateColumnById(columnName, userId, columnId);

        return res.status(200).json(updatedColumn)

    } catch(error){

        if(error.message === "COLUMN_NOT_EXIST"){
            return res.status(404).json({
                error: "Coluna não encontrado"
            });
        }

        if(error.message === "USER_IS_NOT_A_MEMBER"){
            return res.status(403).json({
                error: "Usuário não pertence a este board"
            })
        }

        if(error.message === "USER_DO_NOT_HAVE_PERMISSION"){
            return res.status(403).json({
                error: "Usuário não possui permissão para editar colunas"
            });
        }

        console.log(error)

        return res.status(500).json({
            error: "Erro interno ao atualizar coluna"
        });
    }
}

export async function deleteColumn(req, res){

    const { columnId } = req.params;
    const userId = req.user.id;

    try {

        const deletedColumn = await deleteColumnById(columnId, userId);

        return res.status(200).json(deletedColumn);

    } catch(error){

        if(error.message === "COLUMN_NOT_EXIST"){
            return res.status(404).json({
                error: "Coluna não encontrada"
            })
        }

        if(error.message === "USER_IS_NOT_A_MEMBER"){
            return res.status(403).json({
                error: "Usuário não pertence a este board"
            })
        }

        if(error.message === "USER_DO_NOT_HAVE_PERMISSION"){
            return res.status(403).json({
                error: "Usuário não possui permissão para remover a coluna"
            })
        }

        if(error.message === "COLUMN_HAS_TASKS"){
            return res.status(409).json({
                error: "Não é possível remover uma coluna que possui tarefas"
            });
        }

        return res.status(500).json({
            error: "Erro interno ao remover coluna"
        })
    }

}