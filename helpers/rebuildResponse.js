const moment = require('moment');
module.exports = (timelineData) => {
    return new Promise((resolve, reject) => {
        return resolve(timelineData.map((timeline) => {
            return {
                date: moment.unix(timeline.time).format("YYYY-MM-DD"),
                value: timeline.value[0]
            }
        }))
    });
}
