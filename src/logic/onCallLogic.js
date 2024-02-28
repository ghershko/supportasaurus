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

const countWeeksUntilNextOnCall = (name) => {
    const currentOnCall = getCurrentOnCall();
    const currentIndex = onCallRotation.indexOf(currentOnCall);
    let weeksUntil = 0;

    for (let i = currentIndex; i < currentIndex + onCallRotation.length; i++) {
        const onCallPerson = onCallRotation[i % onCallRotation.length].toLowerCase();
        if (onCallPerson.includes(name.toLowerCase())) {
            break;
        }
        weeksUntil++;
    }

    return weeksUntil === onCallRotation.length ? 0 : weeksUntil;
};

const getDateRangeForNextOnCall = (weeksUntil) => {
    const currentDate = dayjs();
    const startDate = currentDate.add(weeksUntil, 'week').startOf('week');
    const endDate = startDate.add(6, 'day');

    return {start: startDate.format('DD/MM/YYYY'), end: endDate.format('DD/MM/YYYY')};
};

module.exports = {getCurrentOnCall, countWeeksUntilNextOnCall, getDateRangeForNextOnCall}