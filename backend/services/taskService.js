import { permission } from 'process';
import { db } from '../src/prisma/db.ts';

export async function createNewTask(columnId, title, responsibleId, description, priority, dueDate){
    
    const boardId = await db.orm.public.Column
    .select("boardId")
    .where({columnId})
    .first();

    if(!board){
        throw new Error("COLUMN_NOT_EXIST");
    }

    const member = await db.orm.public.BoardMember
    .select("permission")
    .where({boardId: boardId.boardId, userId: responsibleId})
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