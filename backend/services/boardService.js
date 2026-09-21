import { error } from 'console';
import { db } from '../src/prisma/db.ts';



export async function getBoardsByUser(userId){

    const boards = await db.orm.public.BoardMember
    .where({userId})
    .include("board")
    .all()

    return boards;
}


export async function createNewBoard(boardName, ownerId){
//Transaction executa uma cadeira de gravações, caso uma falhe, todos falham e nada é registrado.
//db.transaction passando function array com o parâmetro tx, dentro a gente cria o newBoard, e então em cadeia
//geramos a criação das colunas, A fazer, Em progresso e Concluido, e logo em seguida o registro no boardMember
//Usar para a criação em cadeia o parâmetro tx, pois o db é uma query de fora, e geraria de cada vez cada uma das etapas
// o transaction passa para o tx a regra de esperar todos serem gravados, se não gravar em algum todos retornam erro
    return await db.transaction(async (tx) =>{
        const newBoard = await tx.orm.public.Board
        .create({
            ownerId,
            boardName
        });

        await tx.orm.public.Column
        .create({
            boardId: newBoard.boardId,
            columnName: "A fazer",
            position: 1
        });

        await tx.orm.public.Column
        .create({
            boardId: newBoard.boardId,
            columnName: "Em progresso",
            position: 2
        });

        await tx.orm.public.Column
        .create({
            boardId: newBoard.boardId,
            columnName: "Concluído",
            position: 3
        });

        await tx.orm.public.BoardMember
        .create({
            userId: ownerId,
            boardId: newBoard.boardId,
            permission: 'OWNER'
        })

        return newBoard;
    });
}

export async function selectBoardById(boardId, userId){
    const member = await db.orm.public.BoardMember
    .select("permission")
    .where({userId, boardId})
    .first()

    if(!member){
        throw new Error("BOARD_ACCESS_DENIED");
    }

    const board = await db.orm.public.Board
    .where({boardId})
    .include("columns", (column) => 
        column
            .orderBy((column) => column.position.asc())
            .include("tasks", (task) => task.orderBy((task) => task.position.asc()))
    )
    .first();

    return board;
}

export async function updateBoardById(boardId, userId, boardName){
    
    const board = await db.orm.public.Board
    .where({boardId})
    .first()

    if(!board) {
        throw new Error("BOARD_NOT_EXIST");
    }

    const member = await db.orm.public.BoardMember
    .select("permission")
    .where({boardId, userId})
    .first()

    if(!member || member.permission !== "OWNER"){
        throw new Error("USER_NOT_ALLOWED");
    }

    console.log(member.permission)

    const update = await db.orm.public.Board
    .where({boardId})
    .update({boardName})

    return update;

}