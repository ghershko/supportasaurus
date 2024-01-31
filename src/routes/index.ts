import express from 'express';

const router = express.Router();

router.get('/isAlive', (req, res) => {
    res.send('Server is alive');
});

export default router;
