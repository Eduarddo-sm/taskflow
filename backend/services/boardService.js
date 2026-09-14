import { db } from '../src/prisma/db.ts';


export async function createNewBoard(boardName, ownerId){

    const newBoard = await db.orm.public.Board
    .create({
        ownerId,
        boardName
    })
    
    return newBoard
}