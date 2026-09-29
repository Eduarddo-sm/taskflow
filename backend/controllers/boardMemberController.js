import { addMemberById, getBoardMembers, changePermissionById, deleteUserFromBoardById} from "../services/boardMemberService.js";

export async function addMember(req, res){

    const { boardId } = req.params;
    const { userToAddId } = req.body;
    const userId = req.user.id;

    if(!userToAddId || userToAddId.trim() === ""){
        return res.status(400).json({
            error: "Id de membro inválido"
        });
    }

    try {

        const memberAdded = await addMemberById(boardId, userToAddId, userId);

        return res.status(201).json(memberAdded);

    }catch(error){

        if(error.message === "BOARD_NOT_EXIST"){
            return res.status(400).json({
                error: "Board não existe"
            });
        }

        if(error.message === "USER_IS_NOT_A_MEMBER"){
            return res.status(404).json({
                error: "Usuário não existe ou board não existe"
            });
        }

        if(error.message === "USER_DO_NOT_HAVE_PERMISSION"){
            return res.status(403).json({
                error: "Usuário não possui permissão para adicionar"
            });
        }

        if(error.message === "USER_NOT_EXIST"){
            return res.status(403).json({
                error: "Membro informado não existe"
            });
        }

        if(error.message === "MEMBER_ALREADY_EXIST"){
            return res.status(409).json({
                error: "Usuário já faz parte do boardMember"
            });
        }

        console.log(error);

        return res.status(500).json({
            error: "Erro interno ao adicionar membro"
        });
    }

}

export async function listMembers(req, res){

    const {boardId} = req.params
    const userId = req.user.id;

    try{

        const membersList = await getBoardMembers(boardId, userId);

        return res.status(200).json(membersList);

    }catch(error){

        return res.status(500).json({
            error: "Erro interno ao buscar usuários"
        });
    }

}

export async function changeMemberPermission(req, res){

    const {memberUserId, boardId} = req.params;
    const {permission} = req.body;
    const userId = req.user.id;


    if(!permission || permission.trim() === ""){
        return res.status(400).json({
            error: "Permissão inválida"
        });
    }

    if(!["EDITOR", "VIEWER"].includes(permission)){
        return res.status(400).json({
            error: "Permissão inválida"
        });
    }

    try {

        const userPermission = await changePermissionById(memberUserId, boardId, permission, userId)

        return res.status(200).json(userPermission)

    } catch(error){

        if(error.message === "BOARD_NOT_EXIST"){
            return res.status(404).json({
                error: "board não existe"
            })
        }

        if(error.message === "USER_NOT_A_MEMBER"){
            return res.status(403).json({
                error: "Você não é membro deste Board"
            });
        }

        if(error.message === "TARGET_USER_NOT_EXIST"){
            return res.status(404).json({
                error: "Usuário informado não existe"
            })
        }

        if(error.message === "TARGET_USER_NOT_A_MEMBER_FROM_THIS_BOARD"){
            return res.status(404).json({
                error: "Usuário informado não faz parte do board"
            });
        }

        if(error.message === `USER_ALREADY_IS_${permission}`){
            return res.status(409).json({
                error: "Usuário informado já possui esse nível de permissão"
            });
        }

        if(error.message === "INVALID_PERMISSION"){
            return res.status(403).json({
                error: "Permissão de alteração inválida"
            });
        }

        if(error.message === "CANNOT_CHANGE_THIS_MEMBER_PERMISSION"){
            return res.status(403).json({
                error: "Usuário informado não pode ser alterado o nível de permissão"
            })
        }

        console.log(error);

        return res.status(500).json({
            error: "erro interno ao alterar permissão"
        })
    }



}

export async function deleteMember(req, res){

    const { boardId, memberUserId } = req.params;
    const userId = req.user.id;

    try{

        const deletedMember = await deleteUserFromBoardById(boardId, memberUserId, userId);

        return res.status(200).json(deletedMember);

    }catch(error){

        if(error.message === "MEMBER_CANNOT_DELETE_YOURSELF"){
            return res.status(403).json({
                error: "Acesso negado, você não pode se remover"
            });
        }

        if(error.message === "BOARD_NOT_EXIST"){
            return res.status(404).json({
                error: "O board não existe"
            })
        }

        if(error.message === 'CANNOT_REMOVE_BOARD_OWNER'){
            return res.status(403).json({
                error : "O proprietário do board não pode ser removido"
            });
        }

        if(error.message === "USER_NOT_A_MEMBER_FROM_THIS_BOARD"){
            return res.status(404).json({
                error: "Usuário não faz parte desse board"
            });
        }

        if(error.message === "USER_DO_NOT_HAVE_PERMISSION"){
            return res.status(403).json({
                error: "Usuário não tem permissão para remover membros"
            })
        }

        console.error(error);

        return res.status(500).json({
            error: "Erro interno ao remover membro"
        });
    }
}