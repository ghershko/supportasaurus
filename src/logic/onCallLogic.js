const dayjs = require('dayjs');
const onCallRotation = require('../on-call-rotation');
const weekOfYear = require('dayjs/plugin/weekOfYear');

dayjs.extend(weekOfYear);

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

module.exports = {getCurrentOnCall, countWeeksUntilNextOnCall}