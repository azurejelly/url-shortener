import { Router } from "express";
import { checkKey, checkSession } from "../middleware/auth.middleware";
import prisma from "../lib/prisma";
import logger from "../lib/logger";
import validator, { isAlphanumeric, isEmail, isURL } from "validator";
import gitCommitInfo from "git-commit-info";
import { User } from "@prisma/client";
import { generateRandomString } from "../lib/random";
import { encrypt } from "../lib/password";

const router = Router();
const commit = gitCommitInfo();

router.get('/api', (_, res) => {
    res.json({ status: 200, message: ":3", uptime: process.uptime(), build: { commit } });
});

router.post('/api/create', checkKey, async(req, res, next) => {
    const name: string | undefined = req.body["name"];
    const url: string | undefined = req.body["url"];

    if (!name || !url) {
        res.status(400).json({ status: 400, message: "'name' or 'url' is missing from body!" });
        return;
    }

    if (!isAlphanumeric(validator.blacklist(name, '-_')) || !isURL(url, { require_protocol: true })) {
        res.status(400).json({ status: 400, message: "either 'name' contains invalid characters or 'url' is not a valid url (make sure to include 'http(s)://'!)."});
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

router.post('/api/regenerateKey', checkSession, async(req, res, next) => {
    const user = req.user as User;
    user.key = generateRandomString(32);

    await prisma.user.update({ where: { id: user.id }, data: user })
        .catch((err) => next(err));

    res.json({ status: 200, message: "api key regenerated", data: { key: user.key } });
});

router.patch('/api/accounts/:id', checkSession, async(req, res, next) => {
    const id = Number(req.params['id']);
    const password = req.body["password"];
    
    if (id == null || isNaN(id)) {
        return;
    }

    if (password == null || password.trim() == "") {
        res.status(400).json({ status: 400, message: "'password' is missing or empty" });
        return;
    }

    if (password < 8) {
        res.status(400).json({ status: 400, message: "password is too short" });
        return;
    }

    const user = await prisma.user.findUnique({ where: { id } })
        .catch((err) => next(err));

    if (user == null) {
        res.status(404).json({ status: 404, message: "account not found" });
        return;
    }
    
    user.password = encrypt(password);
    await prisma.user.update({ where: { id: user.id }, data: user })
        .catch((err) => next(err));

    res.status(200).json({ status: 200, message: "password updated" });
});

router.delete('/api/accounts/:id', checkSession, async(req, res, next) => {
    const id = Number(req.params['id']);
    
    if (id == null || isNaN(id)) {
        return;
    }

    const currentUser = req.user as User;
    const user = await prisma.user.findUnique({ where: { id } })
        .catch((err) => next(err));

    if (user == null) {
        res.status(404).json({ status: 404, message: "account not found" });
        return;
    }

    await prisma.user.delete({ where: { id }})
        .catch((err) => next(err))
        .then(() => res.status(200));

    if (currentUser.id === user.id) {
        req.session.destroy(() => res.json({ status: 200, message: "your account has been deleted" }));
    } else {
        res.json({ status: 200, message: "account deleted" });
    }
});

export default router;