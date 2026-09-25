import { db } from "../src/prisma/db.ts"

export async function addMemberById(boardId, userToAddId, userId){

    const board = await db.orm.public.Board
    .where({boardId})
    .first();

    if(!board){
        throw new Error("BOARD_NOT_EXIST");
    }

    const member = await db.orm.public.BoardMember
    .where({userId, boardId})
    .first();

    if(!member){
        throw new Error("USER_IS_NOT_A_MEMBER");
    }

    if(member.permission !== "OWNER"){
        throw new Error("USER_DO_NOT_HAVE_PERMISSION");
    }

    const userToAdd = await db.orm.public.User
    .where({userId: userToAddId})
    .first();

    if(!userToAdd){
        throw new Error("USER_NOT_EXIST");
    }

    
    const newMemberExist  = await db.orm.public.BoardMember
    .where({userId: userToAddId, boardId})
    .first();

    if(newMemberExist ){
        throw new Error("MEMBER_ALREADY_EXIST");
    }

    const newMember = await db.orm.public.BoardMember
    .create({boardId, userId: userToAddId, permission: "VIEWER"})

    return newMember

}

export async function getBoardMembers(boardId, userId){

    const  board = await db.orm.public.Board
    .where({boardId})
    .first();

    if(!board){
        throw new Error("BOARD_NOT_EXIST");
    }

    const member = await db.orm.public.BoardMember
    .where({userId, boardId})
    .first()

    if(!member){
        throw new Error("USER_NOT_A_MEMBER");
    }

    const members = await db.orm.public.BoardMember
    .where({boardId})
    .select("userId", "permission")
    .include("user", (user)=>
        user
            .select("userName", "email")
    )
    .all();

    return members;

}

export async function changePermissionById(memberUserId, boardId, permission, userId){


    const board = await db.orm.public.Board
    .where({boardId})
    .first();

    if(!board){
        throw new Error("BOARD_NOT_EXIST")
    }

    const member = await db.orm.public.BoardMember
    .where({userId, boardId})
    .first();

    if(!member){
        throw new Error("USER_NOT_EXIST");
    }

    if(member.permission !== "OWNER"){
        throw new Error("USER_DO_NOT_HAVE_PERMISSION");
    }

    const memberTarget = await db.orm.public.User
    .where({userId: memberUserId})
    .first();

    if(!memberTarget){
        throw new Error("MEMBER_NOT_EXIST");
    }

    const memberExistOnBoard = await db.orm.public.BoardMember
    .where({boardId, userId: memberUserId})
    .first();

    if(!memberExistOnBoard){
        throw new Error("USER_NOT_A_MEMBER_FROM_THIS_BOARD");
    }

    if(permission === memberExistOnBoard.permission){
        throw new Error(`USER_ALREADY_IS_${permission}`);
    }

    const memberPermissionUpdated = await db.orm.public.BoardMember
    .where({boardId, userId: memberUserId})
    .update({permission});

    return memberPermissionUpdated;


}