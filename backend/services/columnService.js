import { db } from '../src/prisma/db.ts';


export async function createNewColumn(columnName, boardId, userId){

    const board = await db.orm.public.Board
    .where({boardId})
    .first()

    if(!board){
        throw new Error("NOT_FIND_BOARD")
    }

    const member = await db.orm.public.BoardMember
    .where({boardId, userId})
    .first()

    if(!member){
        throw new Error("USER_IS_NOT_A_MEMBER");
    }

    if(!["OWNER", "EDITOR"].includes(member.permission)){
        throw new Error("USER_DO_NOT_HAVE_PERMISSION");
    }

    const lastPosition = await db.orm.public.Column
    .select("position")
    .where({boardId})
    .orderBy((p) => p.position.desc())
    .first();


    const newPosition = lastPosition ? lastPosition.position + 1: 1;
  
    const columnCreated = await db.orm.public.Column
    .create({boardId, columnName: columnName.trim(), position: newPosition})

    return columnCreated;

}

export async function updateColumnById(columnName, userId, columnId){
    
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
    .first();

    if(!member){
        throw new Error("USER_IS_NOT_A_MEMBER")
    }

    if(!["OWNER", "EDITOR"].includes(member.permission)){
        throw new Error("USER_DO_NOT_HAVE_PERMISSION");
    }

    const updatedColumn = await db.orm.public.Column
    .where({boardId: column.boardId, columnId})
    .update({columnName: columnName.trim()})

    return updatedColumn;

}