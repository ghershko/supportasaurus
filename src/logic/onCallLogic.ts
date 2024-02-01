import dayjs from 'dayjs';
import onCallRotation from '../on-call-rotation';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);

export const getCurrentOnCall = () => {
    const currentIndex = dayjs().week() % onCallRotation.length;
    return onCallRotation[currentIndex];
};

export const countWeeksUntilNextOnCall = (name: string) => {
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

