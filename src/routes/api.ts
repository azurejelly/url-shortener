import { Router } from "express";
import { checkKey } from "../middleware/auth.middleware";
import prisma from "../lib/database";
import logger from "../lib/logger";

const router = Router();

router.post('/api/create', checkKey, async(req, res, next) => {
    const name: string | undefined = req.body["name"];
    const url: string | undefined = req.body["url"];

    if (!name || !url) {
        res.status(400).json({ status: 400, message: "'name' or 'url' is missing from body!" });
        return;
    }

    const redirect = await prisma.redirection.findUnique({ where: { name: name }})
        .catch((err) => next(err));

    if (redirect) {
        res.status(409).json({ status: 409, message: "There's already a shortened URL with that name." });
        return;
    }

    const data = {
        name: name,
        url: url
    };

    await prisma.redirection.create({ data: data })
        .catch((err) => next(err))
        .then(() => {
            logger.debug(`A new shortened URL has been created under the name '${name}'. Redirects to ${url}.`);
            res.status(200).json({ status: 200, message: "OK" });
        });
});

router.put('/api/update', checkKey, async(req, res, next) => {
    res.status(418).json({ status: 418, message: "I'm a teapot" });
});

router.delete('/api/delete', checkKey, async(req, res, next) => {
    const name = req.body["name"];

    if (!name) {
        res.status(400).json({ status: 400, message: "'name' is missing from body." });
        return;
    }

    await prisma.redirection.delete({ where: { name: name }})
        .catch((err) => next(err))
        .then(() => res.status(200).json({ status: 200, message: "OK" }))
});

export default router;