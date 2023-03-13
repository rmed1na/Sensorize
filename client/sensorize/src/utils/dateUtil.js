const monthAbbrNames = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
]

function toReadableString(date) {
    if (date) {
        let dateRaw = new Date(date);
        return `${dateRaw.getDate()} ${monthAbbrNames[dateRaw.getMonth()]} ${dateRaw.getFullYear()} ${dateRaw.toLocaleTimeString()}`;
    }

    return '';
}

export default {
    toReadableString
}