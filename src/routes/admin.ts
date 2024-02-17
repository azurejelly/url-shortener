import { Router } from "express";
import { checkSession } from "../middleware/auth.middleware";
import passport from "passport";
import { User } from "@prisma/client";

const router = Router();

router.get('/admin', (_, res) => {
    res.redirect('/admin/login');
});

router.get('/admin/login', (req, res) => {
    const flash = req.flash("error");
    res.render('login', { messages: flash.length == 0 ? null : flash }); // dumb as fuck, please fix
})

router.get('/admin/logout', (req, res) => {
    req.session.destroy(() => res.redirect("/admin"));
});

router.post('/admin/login', passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login',
    failureFlash: true,
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