import { db } from '../src/prisma/db.ts';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const SECRET_KEY_JWT = process.env.KEY_JWT;

if(!SECRET_KEY_JWT){
    throw new Error("KEY_JWT não configurada");
}

async function verifyUser(email, password = null) {
    const verifiedEmail = email.trim().toLowerCase();

    const user = await db.orm.public.User
        .where({ email: verifiedEmail })
        .first();

    if (!user) {
        return { success: false }
    }

    if (password) {
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return { success: false }
        }
    }

    return {
        id: user.userId,
        userName: user.userName,
        success: true
    };

}

export async function registerNewUser(userName, email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const emailExist = await verifyUser(normalizedEmail);
    if (emailExist.success) {
        throw new Error("O email registrado existe");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await db.orm.public.User
        .select("userName", "email")
        .create({
            userName: userName.trim(),
            email: normalizedEmail,
            passwordHash
        })

    return user;

}

export async function authenticateUser(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const { id, userName, success } = await verifyUser(normalizedEmail, password);

    if (!success) {
        throw new Error("email ou senha inválido");
    }

    const token = jwt.sign({ id, userName }, SECRET_KEY_JWT, { expiresIn: '1h' });
    return {token};

}
