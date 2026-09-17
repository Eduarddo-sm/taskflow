import { createNewTask } from "../services/taskService.js";


export async function createTask(req, res){
    const { title, description, priority, dueDate } = req.body;
    const { columnId } = req.params;
    const responsibleId = req.user.id;


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

    try {

        const taskCreated = await createNewTask(columnId, title, responsibleId, description, priority, dueDate);

        return res.status(201).json(taskCreated);

    } catch (error) {
        if(error === "COLUMN_NOT_EXIST"){
            return res.status(404).json(error);
        }

        if(error === "BOARD_ACCESS_DENIED"){
            return res.status(403).json(error);
        }

        if(error === "LOT_ALLOED_EDIT"){
            return res.status(403).json(error);
        }

        return res.status(500).json({
            error: "Erro ao cadastrar tarefa"
        });
    }

}

export async function editTask(req, res){
    const {title, description, priority, dueDate} = req.body;

    const {taskId} = req.params;
    const {responsibleId} = req.user.id;

    const validationPriority = ["HIGH", "MEDIUM", "LOW"]
    const [day, month, year] = dueDate.split("/");
    const dueDateObject = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
    )

    const tasksReceive = {title, description, priority, dueDateObject};

    const tasksToUpdate = Object.fromEntries(
        Object.entries(tasksReceive).filter(([_,valor]) => {
            return valor !== undefined && valor !== null && valor !== "";
        })
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);


    if(!validationPriority.includes(priority)){
        return res.status(400).json({
            error: "Status inserido invalido"
        });
    }

    if(Number.isNaN(dueDateObject.getDate()) || dueDateObject < today) {
        return res.status(400).json({
            error: "Data inserida invalida"
        })
    }



    try {

        const updatedTask = await updateTask(taskId, responsibleId, tasksToUpdate);

        return res.status(201).json(updatedTask);

    } catch(error) {
        return res.status(500).json({
            error: "Falha ao alterar informações", error
        });
    }




}