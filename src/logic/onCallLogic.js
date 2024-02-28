const dayjs = require('dayjs');
const onCallRotation = require('../on-call-rotation');
const weekOfYear = require('dayjs/plugin/weekOfYear');
const updateLocale = require('dayjs/plugin/updateLocale');

dayjs.extend(weekOfYear);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
    weekStart: 1 // Monday is the first day of the week
});

const getCurrentOnCall = () => {
    const currentIndex = dayjs().week() % onCallRotation.length;
    return onCallRotation[currentIndex];
};

const calculateOnCallPersonForWeekIndex = (weekIndex) => {
    const currentOnCall = getCurrentOnCall();
    const currentIndex = onCallRotation.indexOf(currentOnCall);
    return onCallRotation[(currentIndex + weekIndex) % onCallRotation.length];
};

const calculateWeeksUntilSpecificOnCall = (name) => {
    let weeksUntil = 0;
    let onCallPerson = calculateOnCallPersonForWeekIndex(weeksUntil);

    while (onCallPerson.toLowerCase() !== name.toLowerCase()) {
        weeksUntil++;
        onCallPerson = calculateOnCallPersonForWeekIndex(weeksUntil);
    }

    return weeksUntil === onCallRotation.length ? 0 : weeksUntil;
};

const calculateDateRangeForNextOnCall = (weeksUntil) => {
    const currentDate = dayjs();
    const startDate = currentDate.add(weeksUntil, 'week').startOf('week');
    const endDate = startDate.add(6, 'day');

    return {start: startDate.format('DD/MM/YYYY'), end: endDate.format('DD/MM/YYYY')};
};

const getOnCallPersonForNextXWeeks = (weeks) => {
    return calculateOnCallPersonForWeekIndex(Number(weeks));
};

const getFullOnCallRotation = () => onCallRotation;

module.exports = {
    getCurrentOnCall,
    calculateWeeksUntilSpecificOnCall,
    calculateDateRangeForNextOnCall,
    getOnCallPersonForNextXWeeks,
    getFullOnCallRotation
};
