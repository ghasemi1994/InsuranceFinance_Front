
import moment from 'moment-jalaali';

function numberToArray(number: number) {
    return String(number).split('').map(Number);
}

function persianToEnglishNumber(persianNumber: string) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let englishNumber = persianNumber;
    for (let i = 0; i < 10; i++) {
        const regex = new RegExp(persianDigits[i], 'g');
        englishNumber = englishNumber.replace(regex, englishDigits[i]);
    }
    return englishNumber;
}


function toPersianDate(date: Date | null) {
    if (!date)
        return null;
    const res = date.toLocaleDateString("fa-IR", { day: '2-digit', month: '2-digit', year: 'numeric' })
    return persianToEnglishNumber(res);
}


function toMiladiDate(persianDateString: string | null): Date | null {
    if (!persianDateString) return null;
    return moment(persianDateString, 'jYYYY/jMM/jDD').toDate();
}

function toCamelCase(value: any): any {

    if (Array.isArray(value)) {
        return value.map(item => toCamelCase(item));
    }
    if (value && typeof value === 'object') {
        const newObj: any = {};
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {

                const camelKey = key.charAt(0).toLowerCase() + key.slice(1);

                newObj[camelKey] = toCamelCase(value[key]);
            }
        }
        return newObj;
    }

    return value;
}


export {
    numberToArray,
    toPersianDate,
    toMiladiDate,
    toCamelCase
}