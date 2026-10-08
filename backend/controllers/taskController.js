import { createNewTask, updateTask, removeTask, moveTaskById } from "../services/taskService.js";


export async function createTask(req, res){
    const { title, description, priority, dueDate, responsibleId } = req.body;
    const { columnId } = req.params;
    const userId = req.user.id;

    const validPriorities = ["LOW", "MEDIUM", "HIGH"];
    const [day, month, year] = dueDate.split("/");
    const dueDateObject = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!title || title.trim() === ""){
        return res.status(400).json({
            error: "Titulo inserido inválido"
        });
    }

    if (!description || description.trim() === ""){
        return res.status(400).json({
            error: "Descrição inserida inválido"
        });
    }

    if(!validPriorities.includes(priority)) {
        return res.status(400).json({
            error: "Nível de prioridade inválido"
        });
    }

    if(!dueDate || dueDate.trim() === ""){
        return res.statuts(400).json({
            error: "Data inserida inválida"
        });
    }

    if(Number.isNaN(dueDateObject.getTime()) || dueDateObject < today){
        return res.status(400).json({
            error: "Data prazo inválida"
        });
    }

    if(!responsibleId || responsibleId.trim() === ""){
        return res.status(400).json({
            error: "Responsável inválido"
        });
    }

    try {

        const taskCreated = await createNewTask(columnId, title, responsibleId, description, priority, dueDate, userId);

        return res.status(201).json(taskCreated);

    } catch (error) {
        if(error.message === "COLUMN_NOT_EXIST"){
            return res.status(404).json({
                error: "A coluna não existe"
            });
        }

        if(error.message === "BOARD_NOT_EXIST"){
            return res.status(404).json({
                error: "O board não existe"
            });
        }

        if(error.message === "BOARD_ACCESS_DENIED"){
            return res.status(403).json({
                error: "O board não existe"
            });
        }

        if(error.message === "NOT_ALLOWED_EDIT"){
            return res.status(403).json({
                error: "Você não tem permissão para editar"
            });
        }

        if(error.message === "RESPONSIBLE_TARGET_NOT_EXIST"){
            return res.status(404).json({
                error: "Responsável pela tarefa não existe"
            });
        }

        if(error.message === "RESPONSIBLE_TARGET_NOT_EXIST_ON_BOARD"){
            return res.status(404).json({
                error: "Responsável pela tarefa não existe"
            });
        }

        return res.status(500).json({
            error: "Erro ao cadastrar tarefa"
        });
    }

}

export async function editTask(req, res){
    const {title, description, priority, dueDate, responsibleId} = req.body;
    const {taskId} = req.params;
    const userId = req.user.id;    
    const validationPriority = ["HIGH", "MEDIUM", "LOW"];
    const tasksToUpdate = {};

    if(title !== undefined){
        if(!title || title.trim() === ""){
            return res.status(400).json({
                error: "Título inválido"
            });
        }

        tasksToUpdate.title = title.trim();
    }

    if (description !== undefined) {
        if (!description || description.trim() === "") {
            return res.status(400).json({
                error: "Descrição inválida"
            });
        }

        tasksToUpdate.description = description.trim();
    }

    if (priority !== undefined) {
        if (!validationPriority.includes(priority)) {
            return res.status(400).json({
                error: "Prioridade inválida"
            });
        }

        tasksToUpdate.priority = priority;
    }

    if(dueDate !== undefined){
        if(!dueDate || dueDate.trim() === ""){
            return res.status(400).json({
                error: "Data inválida"
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [day, month, year] = dueDate.split("/");
        const dueDateObject = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        )

        if(Number.isNaN(dueDateObject.getDate()) || dueDateObject < today) {
            return res.status(400).json({
                error: "Data inserida invalida"
            });
        }

        tasksToUpdate.dueDate = dueDateObject.toISOString();

    }

    if(responsibleId !== undefined){
        if(!responsibleId || responsibleId.trim() === ""){
        return res.status(400).json({
            error: "Responsável inválido"
        })
    }
        tasksToUpdate.responsibleId = responsibleId.trim()
    }

    if(Object.keys(tasksToUpdate).length === 0){
        return res.status(400).json({
            error: "Nenum campo vído foi enviado para atualização"
        });
    }

    try {

        const updatedTask = await updateTask(taskId, userId, tasksToUpdate);
        return res.status(200).json(updatedTask);

    } catch(error) {

        if(error.message === "TASK_NOT_EXIST"){
            return res.status(404).json({error: "Não foi possível editar"});
        }

        if(error.message === "COLUMN_NOT_EXIST"){
            return res.status(404).json({error: "Não foi possível editar"});
        }

        if(error.message === "BOARD_ACCESS_DENIED"){
            return res.status(403).json({error: "Não foi possível editar"});
        }

        if(error.message === "NOT_ALLOWED_EDIT"){
            return res.status(403).json({error: "Não foi possível editar"});
        }

        if(error.message === "RESPONSIBLE_USER_NOT_EXIST_ON_BOARD"){
            return res.status(404).json({
                error: "Usuário responsável não faz parte desse board"
            });
        }

        return res.status(500).json({
            error: "Falha ao alterar informações"
        });
    }

}

export async function deleteTask(req, res){
    const { taskId } = req.params;
    const userId = req.user.id;
    
    try {

        const response = await removeTask(taskId, userId)

        return res.status(200).json(response);

    } catch (error) {

        if(error.message === "TASK_NOT_EXIST"){
            return res.status(404).json({error: "Tarefa não encontrada"});
        }

        if(error.message === "COLUMN_NOT_EXIST"){
            return res.status(404).json({error: "Tarefa não encontrada"});
        }

        if(error.message === "BOARD_ACCESS_DENIED"){
            return res.status(403).json({error: "Tarefa não encontrada"});
        }

        if(error.message === "NOT_ALLOWED_EDIT"){
            return res.status(403).json({error: "Tarefa não encontrada"});
        }

        res.status(500).json({
            error: "Falha ao deletar"
        });
    }

}

export async function moveTask(req, res){

    const { columnId, position } = req.body;
    const { taskId } = req.params;
    const userId = req.user.id;

    if(!columnId || columnId.trim() === ""){
        return res.status(400).json({
            error: "Coluna de destino inválida"
        });
    }

    if(!Number.isInteger(position) || position < 1){
        return res.status(400).json({
            error: "Posição inválida"
        });
    }

    try {

        const movedTask = await moveTaskById(taskId, userId, columnId, position);

        return res.status(200).json(movedTask)

    } catch (error){

        if(error.message === "TASK_NOT_EXIST"){
            return res.status(404).json({
                error: "Tarefa não existe"
            })
        }

        if(error.message === "BOARD_NOT_EXIST"){
            return res.status(404).json({
                error: "Board não encontrado"
            })
        }

        if(error.message === "USER_NOT_EXIST_IN_BOARD"){
            return res.status(403).json({
                error: "Usuário não encontrado no board"
            })
        }

        if(error.message === "USER_NOT_ALLOWED"){
            return res.status(403).json({
                error: "Usuário sem permissão"
            })
        }

        if(error.message === "DESTINATION_COLUMN_NOT_EXIST"){
            return res.status(404).json({
                error: "Coluna destino não existe"
            })
        }

        if(error.message === "BOARD_DIFFER"){
            return res.status(403).json({
                error: "A coluna de destino pertence a outro board"
            });
        }

        if(error.message === "INVALID_POSITION"){
            return res.status(400).json({
                error: "Posição não existe"
            });
        }

        return res.status(500).json({
            error: "erro interno ao mover tarefa"
        });
    }

}