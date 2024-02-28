const express = require('express');
const { 
    calculateWeeksUntilSpecificOnCall, 
    getCurrentOnCall, 
    calculateDateRangeForNextOnCall, 
    getOnCallPersonForNextXWeeks, 
    getFullOnCallRotation 
} = require('../logic/onCallLogic');

const router = express.Router();

router.get('/isAlive', (req, res) => {
    res.send('Server is alive');
});

router.get('/weeksUntil/:name', (req, res) => {
    const name = req.params.name;
    const weeksUntilNextOnCall = calculateWeeksUntilSpecificOnCall(name);
    const dateRange = calculateDateRangeForNextOnCall(weeksUntilNextOnCall)

    res.send(`${weeksUntilNextOnCall} weeks. From ${dateRange.start} to ${dateRange.end}`);
});

router.get('/current', (_, res) => {
    const currentOnCall = getCurrentOnCall();
    res.send(currentOnCall);
});

router.get('/next/:weeks', (req, res) => {
    const weeks = req.params.weeks;

    const onCall = getOnCallPersonForNextXWeeks(weeks);
    res.send(onCall);
});

router.get('/list', (_, res) => {
    const shifts = getFullOnCallRotation()
    const msg = shifts.map((person, i) => `${i + 1}. ${person}`).join('\n')
    res.send(msg);
});


module.exports =  router;
