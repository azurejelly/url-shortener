import { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma";

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

export const checkSession = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }

    if (req.is('application/json') || req.path.startsWith("/api")) {
        res.status(401).json({ status: 401, message: "unauthorized" });
        return;
    }

    res.redirect('/admin/login');
}

export { checkKey }