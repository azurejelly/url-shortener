import { NextFunction, Request, Response } from "express";
import prisma from "../lib/database";

async function checkKey(req: Request, res: Response, next: NextFunction) {
    const auth: string | undefined = req.headers['authorization'];

    if (!auth) {
        res.status(401).json({ status: 401, message: "authorization header is missing!" });
        return;
    }

    await prisma.user.findUnique({ where: { key: auth }})
        .catch((err) => next(err))
        .then((key) => {
            if (!key) {
                res.status(401).json({ status: 401, message: "invalid api key provided." });
                return;
            }

            next();
        });
}

export function checkSession(req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/admin/login');
    }
}

export { checkKey }