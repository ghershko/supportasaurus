const dayjs = require('dayjs');
const weekOfYear = require('dayjs/plugin/weekOfYear');
const updateLocale = require('dayjs/plugin/updateLocale');
const { onCallSheet } = require('../config');
const { updateSheet, getSpecificSheet } = require('../services/googleSheet.service');
const { shiftArray } = require('../helpers/arrayHelpers');

dayjs.extend(weekOfYear);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
    weekStart: 1 // Monday is the first day of the week
});

const fetchCallRotation = async () =>  {
    const { rowData } = await getSpecificSheet(onCallSheet.docId, onCallSheet.range);
    return rowData.map(row => row.values[0].formattedValue)
};

// To normalize the list in google sheet to the real shifts while taking into account the current week's on-call.
const fetchSiftedCallRotation = async () =>  {
    const rowData = await fetchCallRotation();
    return shiftArray(rowData, 3);
};

const swichOnCallSifts = async (onCallRotation, name1, name2) => {
    if(!onCallRotation.includes(name1)) throw new Error(`${name1} is not in the rotation`) 
    if(!onCallRotation.includes(name2)) throw new Error(`${name2} is not in the rotation`)

    const updatedValues = onCallRotation.map(item => {
        if(item === name1) return name2;
        if(item === name2) return name1;
        return item;
    });

    await updateSheet(
        onCallSheet.docId, 
        onCallSheet.range, 
        updatedValues.map(item => [item])
    );
}

const getCurrentOnCall = (onCallRotation) => {
    const currentIndex = dayjs().week() % onCallRotation.length;
    return onCallRotation[currentIndex];
};

const calculateOnCallPersonForWeekIndex = (onCallRotation, weekIndex) => {
    const currentOnCall = getCurrentOnCall(onCallRotation);
    const currentIndex = onCallRotation.indexOf(currentOnCall);
    return onCallRotation[(currentIndex + weekIndex) % onCallRotation.length];
};

const calculateWeeksUntilSpecificOnCall = (onCallRotation, name) => {
    let weeksUntil = 0;
    let onCallPerson = calculateOnCallPersonForWeekIndex(onCallRotation, weeksUntil);

    while (onCallPerson.toLowerCase() !== name.toLowerCase()) {
        weeksUntil++;
        onCallPerson = calculateOnCallPersonForWeekIndex(onCallRotation, weeksUntil);
    }

    return weeksUntil === onCallRotation.length ? 0 : weeksUntil;
};

const calculateDateRangeOfWeekNum = (weeksUntil) => {
    const currentDate = dayjs();
    const startDate = currentDate.add(weeksUntil, 'week').startOf('week');
    const endDate = startDate.add(6, 'day');

    return {start: startDate.format('DD/MM/YYYY'), end: endDate.format('DD/MM/YYYY')};
};

const getOnCallPersonForNextXWeeks = (onCallRotation, weeks) => {
    return calculateOnCallPersonForWeekIndex(onCallRotation, Number(weeks));
};

const formatOnCallListMsg = (onCallRotation) => {
    return onCallRotation.map((person, i) => { 
        const weeksUntil = calculateWeeksUntilSpecificOnCall(onCallRotation, person)
        const dates = calculateDateRangeOfWeekNum(weeksUntil)

        return `${i + 1}. ${person} / from ${dates.start} / to ${dates.end}`
    }).join('\n');
};


module.exports = {
    getCurrentOnCall,
    calculateWeeksUntilSpecificOnCall,
    calculateDateRangeOfWeekNum,
    getOnCallPersonForNextXWeeks,
    formatOnCallListMsg,
    fetchSiftedCallRotation,
    fetchCallRotation,
    swichOnCallSifts
};
