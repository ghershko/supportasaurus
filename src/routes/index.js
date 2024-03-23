const express = require('express');
const { 
    calculateWeeksUntilSpecificOnCall, 
    getCurrentOnCall, 
    calculateDateRangeOfWeekNum, 
    getOnCallPersonForNextXWeeks,
    formatOnCallListMsg,
    fetchSiftedCallRotation,
    swichOnCallSifts,
    fetchCallRotation,
} = require('../logic/onCallLogic');

const router = express.Router();

router.get('/isAlive', (_, res) => {
    res.send('Server is alive');
});

router.get('/weeksUntil/:name', async (req, res) => {
    const name = req.params.name;

    const onCallRotation = await fetchSiftedCallRotation();
    const weeksUntilNextOnCall = calculateWeeksUntilSpecificOnCall(onCallRotation, name);
    const dateRange = calculateDateRangeOfWeekNum(weeksUntilNextOnCall);

    res.send(`${weeksUntilNextOnCall} weeks. From ${dateRange.start} to ${dateRange.end}`);
});

router.get('/current', async (_, res) => {
    const onCallRotation = await fetchSiftedCallRotation();
    const currentOnCall = getCurrentOnCall(onCallRotation);
    res.send(currentOnCall);
});

router.get('/next/:weeks', async (req, res) => {
    const weeks = req.params.weeks;
    
    const onCallRotation = await fetchSiftedCallRotation();
    const onCall = getOnCallPersonForNextXWeeks(onCallRotation, weeks);
    res.send(onCall);
});

router.get('/list', async (_, res) => {
    const onCallRotation = await fetchSiftedCallRotation();
    const msg = formatOnCallListMsg(onCallRotation);
    res.send(msg);
});

router.get('/switch/:name1/:name2', async (req, res) => {
    try {
        const name1 = req.params.name1;
        const name2 = req.params.name2;

        if(!onCallRotation.includes(name1)) res.send(`${name1} is not in the rotation`) 
        if(!onCallRotation.includes(name2)) res.send(`${name2} is not in the rotation`)

        const onCallRotation = await fetchCallRotation();

        await swichOnCallSifts(onCallRotation, name1, name2);
        res.send(`Successfully switched between ${name1} and ${name2}`);
    }
    catch(err) {
        res.status(500).send(err.message);
    }

});

module.exports =  router;
