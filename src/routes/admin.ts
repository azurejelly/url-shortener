import { Router } from "express";

const router = Router();

router.get('/admin*', (_, res) => {
    res.render('error', { title: 'Not Implemented', description: 'This endpoint is not ready to be used! Check back later for updates.' });
});

export default router;