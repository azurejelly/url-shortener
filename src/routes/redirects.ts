import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import prisma from "../lib/database";

const router = Router();
const defaultRedirect = process.env.DEFAULT_REDIRECT || "https://www.google.com";

router.get('/:name', async(req, res, next) => {
    const name: string = req.params['name'];

    await prisma.redirection.findFirst({ where: { name: name }})
        .catch((err) => next(err))
        .then((redirect) => {
            if (!redirect) {
                res.redirect(defaultRedirect);
                return;
            }

            res.redirect(redirect.url);
        });
});

router.get('/', (_, res) => res.redirect(defaultRedirect));

export default router;