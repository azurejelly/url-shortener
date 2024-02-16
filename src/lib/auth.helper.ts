import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import prisma from "./database";

const salt = genSaltSync(10);

export async function authenticate(email: string, password: string) {
    if (!email || !password) {
        return null;
    }

    const user = await prisma.user.findFirst({ where: { email: email }});
    
    if (!user) {
        return null;
    }

    if (compareSync(password, user.password)) {
        return user.name;
    }

    return null;
}

export function encryptPassword(password: string)  {
    return hashSync(password, salt);
};