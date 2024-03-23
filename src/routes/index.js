const express = require('express');
const { 
    calculateWeeksUntilSpecificOnCall, 
    getCurrentOnCall, 
    calculateDateRangeOfWeekNum, 
    getOnCallPersonForNextXWeeks,
    formatOnCallListMsg,
    fetchCallRotation,
} = require('../logic/onCallLogic');

const router = express.Router();

router.get('/isAlive', (_, res) => {
    res.send('Server is alive');
});

router.get('/weeksUntil/:name', async (req, res) => {
    const name = req.params.name;

    const onCallRotation = await fetchCallRotation();
    const weeksUntilNextOnCall = calculateWeeksUntilSpecificOnCall(onCallRotation, name);
    const dateRange = calculateDateRangeOfWeekNum(weeksUntilNextOnCall);

    res.send(`${weeksUntilNextOnCall} weeks. From ${dateRange.start} to ${dateRange.end}`);
});

router.get('/current', async (_, res) => {
    const onCallRotation = await fetchCallRotation();
    const currentOnCall = getCurrentOnCall(onCallRotation);
    res.send(currentOnCall);
});

router.get('/next/:weeks', async (req, res) => {
    const weeks = req.params.weeks;

    const onCallRotation = await fetchCallRotation();
    const onCall = getOnCallPersonForNextXWeeks(onCallRotation, weeks);
    res.send(onCall);
});

router.get('/list', async (_, res) => {
    const onCallRotation = await fetchCallRotation();
    const msg = formatOnCallListMsg(onCallRotation);
    res.send(msg);
});


module.exports =  router;
