import { Router } from "express";
import { authenticate } from "../lib/auth.helper";
import { checkSession } from "../middleware/auth.middleware";
import isEmail from "validator/lib/isEmail";

const router = Router();

router.get('/admin', (_, res) => {
    res.redirect('/admin/login');
});

router.get('/admin/login', (_, res) => {
    res.render('login');
})

router.get('/admin/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect("/admin");
    });
});

router.post('/admin/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password || !isEmail(email)) {
        res.render('login', { message: "authentication failed. please check your email and password." });
        return;
    }

    const user = await authenticate(req.body.email, req.body.password);

    if (user != null) {
        req.session.regenerate(() => {
            req.session.user = user!;
            res.redirect('/admin/dashboard');
        });
    } else {
        res.render('login', { message: "authentication failed. please check your email and password." });
    }
});

router.post('/admin/updatePassword', (req, res) => {
    res.render('error', { title: "not implemented", description: "this endpoint is not available yet" });
});

router.get('/admin/dashboard', checkSession, (req, res) => {
    res.render('dashboard', { username: req.session.user });
});

export default router;