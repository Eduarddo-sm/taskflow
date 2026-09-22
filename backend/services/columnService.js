import { db } from '../src/prisma/db.ts';


export async function createNewColumn(columnName, boardId, userId){

    const board = db.orm.public.Board
    .where({boardId})
    .first()

    if(!board){
        throw new Error("NOT_FIND_BOARD")
    }

    const member = db.orm.public.BoardMember
    .where({boardId, userId})
    .first()

    if(!member){
        throw new Error("USER_IS_NOT_A_MEMBER");
    }

    if(!member.permission === "OWNER" || !member.permission === "EDITOR"){
        throw new Error("USER_DO_NOT_HAVE_PERMISSION");
    }

    const lastPosition = db.orm.public.Column
    .select("position")
    .where({boardId})
    .orderBy((p) => p.position.desc())
    .first();

    const newPosition = Number(lastPosition ? lastPosition.position + 1: 1)

    const columnCreated = db.orm.public.Column
    .where({boardId})
    .createAll({columnName, position: newPosition})

    return columnCreated;

}