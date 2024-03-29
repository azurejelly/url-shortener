import { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma";
import logger from "../lib/logger";

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
        logger.debug(`request is authenticated`);
        return next();
    }

    if (req.is('application/json') || req.path.startsWith("/api")) {
        logger.debug(`unauthorized request is for the api`);
        res.status(401).json({ status: 401, message: "unauthorized" });
        return;
    }

    res.redirect('/admin/login');
    logger.debug(`redirecting to login (text/html)`);
}

export { checkKey }