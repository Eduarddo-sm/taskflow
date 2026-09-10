import { registerNewUser } from "../services/authService.js";

export async function registerUser(req, res){
   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const {userName, email, password} = req.body;

    if(!userName || userName.trim() === ""){
        return res.status(400).json(
            {error: "Nome inválido"}
        )
    }   

    if (!email || !emailRegex.test(email.trim())) {
        return res.status(400).json({
            error: "Email inválido"
        });
    }

    if(!password || password.trim() === ""){
    return res.status(400).json(
        {error: "Senha inválida"}
        )
    }

    try {

        const user = await registerNewUser(userName, email, password);
        return res.status(201).json(user);

    } catch(error){
        if(error.message === "O email registrado existe"){
            return res.status(409).json(
                {error: error.message}
            )};

        return res.status(500).json({
            error: "Erro interno ao cadastrar o usuário"
        });
    }
}