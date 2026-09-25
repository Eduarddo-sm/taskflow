import {addMemberById} from "../services/boardMemberService.js";

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