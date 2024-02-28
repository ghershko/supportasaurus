const express = require('express');
const { countWeeksUntilNextOnCall, getCurrentOnCall, getDateRangeForNextOnCall } = require('../logic/onCallLogic');

const router = express.Router();

router.get('/isAlive', (req, res) => {
    res.send('Server is alive');
});

router.get('/when/:name', (req, res) => {
    const name = req.params.name;
    const weeksUntilNextOnCall = countWeeksUntilNextOnCall(name);
    const dateRange = getDateRangeForNextOnCall(weeksUntilNextOnCall)

    res.send(`${weeksUntilNextOnCall} weeks. From ${dateRange.start} to ${dateRange.end}`);
});

router.get('/current', (_, res) => {
    const currentOnCall = getCurrentOnCall();
    res.send(currentOnCall);
});


module.exports =  router;
