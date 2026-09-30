import { db } from '../src/prisma/db.ts';

export async function createNewTask(columnId, title, responsibleId, description, priority, dueDate, userId){
    
    const column = await db.orm.public.Column
    .select("boardId")
    .where({columnId})
    .first();

    if(!column){
        throw new Error("COLUMN_NOT_EXIST");
    }

    const member = await db.orm.public.BoardMember
    .select("permission")
    .where({boardId: column.boardId, userId})
    .first()

    if(!member) {
        throw new Error("BOARD_ACCESS_DENIED");
    }

    if (member.permission === "VIEWER") {
        throw new Error("NOT_ALLOWED_EDIT");
    }

    const userResponsibleExist = await db.orm.public.User
    .where({userId: responsibleId})
    .first();

    if(!userResponsibleExist){
        throw new Error("RESPONSIBLE_TARGET_NOT_EXIST")
    }

    const userResponsible = await db.orm.public.BoardMember
    .where({boardId: column.boardId, userId: responsibleId})
    .first();

    if(!userResponsible){
        throw new Error("RESPONSIBLE_TARGET_NOT_EXIST_ON_BOARD");
    }

    const [day, month, year] = dueDate.split('/');
    const newDueDate = `${year}-${month}-${day}`;
    const lastPosition = await db.orm.public.Task
    .select("position")
    .where({columnId})
    .orderBy((Task) => Task.position.desc())
    .first();

    const newPosition = Number( lastPosition ? lastPosition.position + 1: 1); 


    const task = await db.orm.public.Task
    .create({
        columnId,
        title,
        responsibleId,
        description,
        priority,
        position: newPosition,
        dueDate: newDueDate
    })

    return task

}

export async function updateTask(taskId, userId, tasksToUpdate){

    const task = await db.orm.public.Task
    .select("columnId")
    .where({taskId})
    .first();

    if(!task){
        throw new Error("TASK_NOT_EXIST");
    }

    const column = await db.orm.public.Column
    .select("boardId")
    .where({columnId: task.columnId})
    .first();

    if(!column){
        throw new Error("COLUMN_NOT_EXIST");
    }

    const member = await db.orm.public.BoardMember
    .select("permission")
    .where({boardId: column.boardId, userId})
    .first()

    if(!member) {
        throw new Error("BOARD_ACCESS_DENIED");
    }

    if (member.permission === "VIEWER") {
        throw new Error("NOT_ALLOWED_EDIT");
    }

    if(tasksToUpdate.responsibleId){
       
        const responsibleExist = await db.orm.public.BoardMember
        .where({boardId: column.boardId, userId: tasksToUpdate.responsibleId})
        .first();

        if(!responsibleExist){
            throw new Error("RESPONSIBLE_USER_NOT_EXIST_ON_BOARD");
        }

    }

    const updatedTask = await db.orm.public.Task
        .where({taskId})
        .updateAll(tasksToUpdate);

    return updatedTask;

}

// Falta implementar o recalculo de posições
export async function removeTask(taskId, userId) {

    const task = await db.orm.public.Task
    .select("columnId")
    .where({taskId})
    .first();

    if(!task){
        throw new Error("TASK_NOT_EXIST");
    }

    const column = await db.orm.public.Column
    .select("boardId")
    .where({columnId: task.columnId})
    .first();

    if(!column){
        throw new Error("COLUMN_NOT_EXIST");
    }

    const member = await db.orm.public.BoardMember
    .select("permission")
    .where({boardId: column.boardId, userId})
    .first()

    if(!member) {
        throw new Error("BOARD_ACCESS_DENIED");
    }

    if (member.permission === "VIEWER") {
        throw new Error("NOT_ALLOWED_EDIT");
    }

    const removedTask = await db.orm.public.Task
    .where({taskId})
    .delete();

    await reorderTasksInColumn(task.columnId);

    return removedTask;

}


async function reorderTasksInColumn(columnId){

    const tasks = await db.orm.public.Task
    .where({columnId})
    .orderBy((task) => task.position.asc())
    .all()

    return tasks

}

async function  moveTaskById(taskId, userId, columnId, position) {
    
    

}