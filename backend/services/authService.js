import { db } from '../src/prisma/db.ts';
import bcrypt from "bcrypt";

async function verifyEmail(email) {
    const verifiedEmail = email.trim();

    const existingUser = await db.orm.public.User
    .where({email: verifiedEmail})
    .first();

    return Boolean(existingUser);
}

export async function registerNewUser(userName, email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const emailExist = await verifyEmail(normalizedEmail);
 
    if (emailExist) {
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

