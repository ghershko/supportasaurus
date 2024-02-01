import express from 'express';
import { countWeeksUntilNextOnCall, getCurrentOnCall } from '../logic/onCallLogic';

const router = express.Router();

router.get('/isAlive', (req, res) => {
    res.send('Server is alive');
});

router.get('/when/:name', (req, res) => {
    const name = req.params.name;
    const weeksUntilNextOnCall = countWeeksUntilNextOnCall(name);

    res.send(`${weeksUntilNextOnCall} weeks`);
});

router.get('/current', (_, res) => {
    const currentOnCall = getCurrentOnCall();
    res.send(currentOnCall);
});


export default router;
