import { createNewTask } from "../services/taskService.js";


export async function createTask(req, res){
    const { title, description, priority, dueDate } = req.body;
    const userId = req.user.id;

    if (!title || title.trim() === ""){
        return res.status(404).json({
            error: "Titulo inserido inválido"
        });
    }

    if(!priority === "LOW" || !priority === "MEDIUM" || !priority === "HIGH") {
        return res.status(404).json({
            error: "Nível de prioridade inválido"
        });
    }

    if(!dueDate || dueDate.trim() === ""){
        return res.statuts(404).json({
            error: "Data inserida inválida"
        });
    }

    try {

        const task = await createNewTask(title, description, priority, dueDate)

    } catch (error) {

    }

}