const express = require('express');
const { countWeeksUntilNextOnCall, getCurrentOnCall } = require('../logic/onCallLogic');

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


module.exports =  router;
