const digitSeprator = (money: number | null) => {
    if (!money) return "0";
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * تبدیل عدد به حروف فارسی
 * @param num عدد مورد نظر برای تبدیل
 * @returns متن معادل به حروف فارسی
 */
const numberToPersianWords = (
    num: number,
    currencyType?: 'Rial' | 'Toman' | ''
): string => {
    if (num === 0 || num < 0) return '';

    // اگر تومان باشه → ریال به تومان تبدیل بشه
    if (currencyType === 'Toman') {
        num = Math.floor(num / 10);
    }

    const currencyText =
        currencyType === 'Rial'
            ? 'ریال'
            : currencyType === 'Toman'
                ? 'تومان'
                : '';

    const units = [
        '',
        'یک',
        'دو',
        'سه',
        'چهار',
        'پنج',
        'شش',
        'هفت',
        'هشت',
        'نه',
        'ده',
        'یازده',
        'دوازده',
        'سیزده',
        'چهارده',
        'پانزده',
        'شانزده',
        'هفده',
        'هجده',
        'نوزده',
    ];

    const tens = [
        '',
        '',
        'بیست',
        'سی',
        'چهل',
        'پنجاه',
        'شصت',
        'هفتاد',
        'هشتاد',
        'نود',
    ];

    const hundreds = [
        '',
        'صد',
        'دویست',
        'سیصد',
        'چهارصد',
        'پانصد',
        'ششصد',
        'هفتصد',
        'هشتصد',
        'نهصد',
    ];

    const scales = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون'];

    const convertChunk = (chunk: number): string => {
        if (chunk === 0) return '';

        let result = '';
        const hundred = Math.floor(chunk / 100);
        const remainder = chunk % 100;

        if (hundred > 0) {
            result += hundreds[hundred] + ' و ';
        }

        if (remainder < 20) {
            result += units[remainder];
        } else {
            const ten = Math.floor(remainder / 10);
            const unit = remainder % 10;
            result += tens[ten];
            if (unit > 0) {
                result += ' و ' + units[unit];
            }
        }

        return result.trim();
    };

    let result = '';
    let scaleIndex = 0;
    let remaining = num;

    while (remaining > 0) {
        const chunk = remaining % 1000;
        remaining = Math.floor(remaining / 1000);

        if (chunk !== 0) {
            let chunkStr = convertChunk(chunk);
            if (scaleIndex > 0) {
                chunkStr += ' ' + scales[scaleIndex];
            }
            result = chunkStr + (result ? ' و ' + result : '');
        }

        scaleIndex++;
    }

    return `${result.trim()} ${currencyText}`.trim();
};

export const truncateText = (text: string, maxLength: number, preserveWords = true) => {
    if (!text) return text;
    if (text.length <= maxLength) return text;

    if (preserveWords) {
        // Find the last space before maxLength
        const lastSpace = text.lastIndexOf(' ', maxLength);
        return text.substring(0, lastSpace > 0 ? lastSpace : maxLength) + '...';
    }

    return text.substring(0, maxLength) + '...';
};


export { digitSeprator, numberToPersianWords }