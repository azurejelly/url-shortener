import { Router } from "express";
import { checkKey } from "../middleware/auth.middleware";
import prisma from "../lib/database";
import logger from "../lib/logger";
import validator, { isAlphanumeric, isURL } from "validator";
import gitCommitInfo from "git-commit-info";

const router = Router();
const commit = gitCommitInfo();

router.get('/api', (_, res) => {
    res.json({ status: 200, message: "meow", uptime: process.uptime(), build: { commit } });
});

router.post('/api/create', checkKey, async(req, res, next) => {
    const name: string | undefined = req.body["name"];
    const url: string | undefined = req.body["url"];

    if (!name || !url) {
        res.status(400).json({ status: 400, message: "'name' or 'url' is missing from body!" });
        return;
    }

    if (!isAlphanumeric(validator.blacklist(name, '-_')) || !isURL(url)) {
        res.status(400).json({ status: 400, message: "either 'name' contains invalid characters or 'url' is not a valid url."});
        return;
    }

    const redirect = await prisma.redirection.findUnique({ where: { name: name }})
        .catch((err) => next(err));

    if (redirect) {
        res.status(409).json({ status: 409, message: "there's already a shortened url with that name." });
        return;
    }

    const data = {
        name: name,
        url: url
    };

    await prisma.redirection.create({ data: data })
        .catch((err) => next(err))
        .then(() => {
            logger.debug(`a new shortened url has been created under the name '${name}'. redirects to ${url}.`);
            res.status(200).json({ status: 200, message: "shortened url created." });
        });
});

router.delete('/api/delete', checkKey, async(req, res, next) => {
    const name = req.body["name"];

    if (!name) {
        res.status(400).json({ status: 400, message: "'name' is missing from body." });
        return;
    }

    await prisma.redirection.delete({ where: { name: name }})
        .catch((err) => next(err))
        .then(() => res.status(200).json({ status: 200, message: "shortened url deleted." }))
});

export default router;