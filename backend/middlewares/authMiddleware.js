import jwt from "jsonwebtoken";
import "dotenv/config";

const authenticateToken = (req, res, next) => {

    //Extração do token pelo 'Authorization header' no formato Bearer TOKEN
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Acesso negado. Token não informado"
        });
    }

    const token = authHeader && authHeader.split('')[1];

    try {
        //Verificar o token utilizando a chave de acesso jwt
        const decoded = jwt.verify(token, process.env.KEY_JWT);
        //anexar o payload ao objeto de requisição para uso em outra rotas
        req.user = decoded;
        //Passar o controle para o próximo middleware ou rota
        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Token inválido ou expirado'
        });
    }
};

export default authenticateToken;