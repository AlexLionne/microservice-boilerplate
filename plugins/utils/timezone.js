const moment = require('moment-timezone')

moment.locale('fr')

module.exports.getLocalTime = (timezone, date, keepLocal = false) => {

    if(!timezone)
        return moment()

    if(keepLocal) {
        if(!date) {
            return moment.tz(timezone).format('YYYY-MM-DD HH:mm:ss')
        } else {
            return moment(date).tz(timezone).format('YYYY-MM-DD HH:mm:ss')
        }
    }


    if (!date)
        date = moment()

    const utcOffset = moment.tz(moment.utc(), 'Europe/Paris').utcOffset()
    const timeZoneOffset = moment.tz(timezone).utcOffset()

    if (timeZoneOffset < utcOffset) {
        //West
        return moment(date.utcOffset(timeZoneOffset)).add(-1 * timeZoneOffset + utcOffset, 'minutes').format('YYYY-MM-DD HH:mm:ss')
    } else if (timeZoneOffset > utcOffset) {
        //East
        return moment(date.utcOffset(timeZoneOffset)).subtract(timeZoneOffset - utcOffset, 'minutes').format('YYYY-MM-DD HH:mm:ss')
    } else {
        return date.format('YYYY-MM-DD HH:mm:ss')
    }

}
