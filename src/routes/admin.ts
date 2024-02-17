import { Router } from "express";
import { checkSession } from "../middleware/auth.middleware";
import passport from "passport";
import { User } from "@prisma/client";

const router = Router();

router.get('/admin', (_, res) => {
    res.redirect('/admin/login');
});

router.get('/admin/login', (req, res) => {
    res.render('login', { messages: req.session.messages });
})

router.get('/admin/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect("/admin");
    });
});

router.post('/admin/login', passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login',
    failureMessage: "authentication failed. please check your email and password."
}));

router.post('/admin/updatePassword', (_, res) => {
    res.render('error', { title: "not implemented", description: "this endpoint is not available yet" });
});

router.get('/admin/dashboard', checkSession, (req, res) => {
    const user = req.user as User;
    res.render('dashboard', { username: user.name });
});

router.get('/admin/dashboard/apiSettings', checkSession, (req, res) => {
    const user = req.user as User;
    res.render('apiSettings', { apiKey: user.key });
})

export default router;