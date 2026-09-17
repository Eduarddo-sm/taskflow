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