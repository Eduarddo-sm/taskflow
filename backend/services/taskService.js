import { db } from '../src/prisma/db.ts';

export async function createNewTask(columnId, title, responsibleId, description, priority, dueDate){
    
    const column = await db.orm.public.Column
    .select("boardId")
    .where({columnId})
    .first();

    if(!column){
        throw new Error("COLUMN_NOT_EXIST");
    }

    const member = await db.orm.public.BoardMember
    .select("permission")
    .where({boardId: column.boardId, userId: responsibleId})
    .first()

    if(!member) {
        throw new Error("BOARD_ACCESS_DENIED");
    }

    if (member.permission === "VIEWER") {
        throw new Error("NOT_ALLOWED_EDIT");
    }

    const [day, month, year] = dueDate.split('/');
    const newDueDate = `${year}-${month}-${day}`;
    const maxPosition = await db.orm.public.Task
    .select("position")
    .where({columnId})
    .orderBy((Task) => Task.position.desc())
    .first();

    const newPosition = Number( maxPosition ? maxPosition.position + 1: 1); 


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

export async function updateTask(taskId, responsibleId, tasksToUpdate){

    tasksToUpdate.dueDate = tasksToUpdate.dueDateObject;
    delete tasksToUpdate.dueDateObject

    const task = await db.orm.public.Task
    .select("columnId")
    .where({taskId})
    .first();

    if(!task){
        throw new Error("TASK_NOT_EXIST");
    }


    const column = await db.orm.public.Column
    .select("boardId")
    .where({columnId: taskId.columnId})
    .first();

    if(!column){
        throw new Error("COLUMN_NOT_EXIST");
    }

    const member = await db.orm.public.BoardMember
    .select("permission")
    .where({boardId: column.boardId, userId: responsibleId})
    .first()

    if(!member) {
        throw new Error("BOARD_ACCESS_DENIED");
    }

    if (member.permission === "VIEWER") {
        throw new Error("NOT_ALLOWED_EDIT");
    }

    const updatedTask = await db.orm.public.Task
        .where({taskId})
        .update({tasksToUpdate});

    return updatedTask;

}