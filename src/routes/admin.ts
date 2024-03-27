import { Router, Request, Response, NextFunction } from "express";
import { checkSession } from "../middleware/auth.middleware";
import passport from "passport";
import { User } from "@prisma/client";
import prisma from "../lib/prisma";
import { isEmail } from "validator";
import { generateRandomString } from "../lib/random";
import { RecaptchaV2 } from "express-recaptcha";

const captcha = new RecaptchaV2(process.env.RECAPTCHA_SITE_KEY as string, process.env.RECAPTCHA_SECRET_KEY as string, { callback: 'captchaCallback' });
const router = Router();

router.get('/admin', (_, res) => {
    res.redirect('/admin/login');
});

router.get('/admin/login', (req, res) => {
    const flash = req.flash("error");
    res.render('login', { captcha: captcha.render(), messages: flash.length == 0 ? null : flash }); // dumb as fuck, please change it if you're reading this
})

router.get('/admin/logout', (req, res) => {
    req.session.destroy(() => res.redirect("/admin"));
});

router.post('/admin/login',
    captcha.middleware.verify,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.recaptcha?.error) {
            req.flash('error', "captcha verification failed. please try again.");
            res.redirect('/admin/login');
            return;
        }
    
        next();
    },
    passport.authenticate('local', {
        successRedirect: '/admin/dashboard',
        failureRedirect: '/admin/login',
        failureFlash: true,
    })
);

router.get('/admin/dashboard', checkSession, async(req, res, next) => {
    const data = await prisma.redirection.findMany().catch((err) => next(err));
    const user = req.user as User;

    res.render('dashboard', { data: data, username: user.name, key: user.key });
});

router.get('/admin/dashboard/api', checkSession, (req, res) => {
    const user = req.user as User;
    res.render('api', { apiKey: user.key });
});

router.get('/admin/dashboard/accounts', checkSession, async(_, res, next) => {
    const accounts = await prisma.user.findMany().catch((err) => next(err));
    res.render('accounts/main', { accounts: accounts });
});

router.get('/admin/dashboard/accounts/add', checkSession, async(_req, res, _next) => {
    res.render('accounts/add');
});

router.post('/admin/dashboard/accounts/add', checkSession, async(req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if (!name || name.trim() == "") {
        res.status(400).render('accounts/add', { error: 'missing account username. try again.' });
        return;
    }

    if (!email || email.trim() == "" || !isEmail(email)) {
        res.status(400).render('accounts/add', { error: 'the provided email is null or invalid. try again.' });
        return;
    }

    if (password == null || password.trim() == "") {
        res.status(400).render('accounts/add', { error: 'an invalid password was provided. try again.' });
        return;
    }

    if (password.length < 8) {
        res.status(400).render('accounts/add', { error: 'the password you entered is too short. try again.' });
        return;
    }

    const unique = await prisma.user.findUnique({ where: { email }})
        .catch((err) => next(err));

    if (unique) {
        res.status(409).render('accounts/add', { error: "a user with that email already exists. try again." });
        return;
    }

    const account = {
        name: name,
        email: email,
        password: password,
        key: generateRandomString(32)
    };

    await prisma.user.create({ data: account })
        .catch((err) => next(err));

    res.status(200).redirect('/admin/dashboard/accounts');
});

export default router;