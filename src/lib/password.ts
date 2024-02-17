import { compareSync, genSaltSync, hashSync } from "bcryptjs";

const salt = genSaltSync(10);

export const encrypt = (password: string) =>  {
    return hashSync(password, salt);
};

export const compare = (plain: string, hash: string) => {
    return compareSync(plain, hash);
}