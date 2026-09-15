import { db } from '../src/prisma/db.ts';



export async function getBoardsByUser(userId){

    const boards = db.orm.public.BoardMember
    .where({userId})
    .include("board")
    .all()

    return boards;
}

//Transaction executa uma cadeira de gravações, caso uma falhe, todos falham e nada é registrado.
export async function createNewBoard(boardName, ownerId){
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