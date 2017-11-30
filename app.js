const express = require('express');
const googleTrends = require('google-trends-api');
const moment = require('moment')
const bodyParser = require('body-parser');
const getTimeFrame = require('./helpers/getTimeFrame');
const responseRebuilder = require('./helpers/rebuildResponse');
const csvBuilder = require('./helpers/makeCsv');


const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


app.get('/trendcsv/', (req, res) => {
    const keyword = req.query.keyword;
    const currentDate = new Date(Date.now());
    const startTime = req.query.start_date ? new Date(req.query.start_date) : new Date('2004-01-01');
    const differenceInDate = moment(currentDate).diff(moment(startTime), 'days');
    const differenceInDateMonth = moment(currentDate).diff(moment(startTime), 'months');
    return googleTrends.interestOverTime({
        keyword,
        startTime,
    }).then((data) => {
        let timelineResponse = JSON.parse(data);
        if (timelineResponse.default.timelineData.length == 0) {
            // Generate empty CSV
            const emptyData = [{
                date: null,
                value: null
            }]
            return csvBuilder(emptyData, ["date", "value"], keyword, 'error').then((response) => {
                return res.download(`csv/${keyword}-error.csv`, `${keyword}-error.csv`);
            }).catch((err) => {
                // Catch this error
            })
        }
        const frame = getTimeFrame(timelineResponse.default.timelineData[0].formattedTime)

        responseRebuilder(timelineResponse.default.timelineData).then((finalData) => {
            return csvBuilder(finalData, ["date", "value"], keyword, frame).then((response) => {
                return res.download(`csv/${keyword}-${frame.toLowerCase()}.csv`, `${keyword}-${frame.toLowerCase()}.csv`);
            }).catch((err) => {
                // Catch this error
            })
        });
    });
});

app.get('/trendjson/', (req, res) => {
    const keyword = req.query.keyword;
    const geo = req.query.geo;
    const currentDate = new Date(Date.now());
    const startTime = req.query.start_date ? new Date(req.query.start_date) : new Date('2004-01-01');
    const differenceInDate = moment(currentDate).diff(moment(startTime), 'days');
    const differenceInDateMonth = moment(currentDate).diff(moment(startTime), 'months');
    return googleTrends.interestOverTime({
        keyword,
        startTime,
    }).then((data) => {
        let timelineResponse = JSON.parse(data);

        if (timelineResponse.default.timelineData.length == 0) {
            return res.json({
            })
        }
        const frame = getTimeFrame(timelineResponse.default.timelineData[0].formattedTime)

        responseRebuilder(timelineResponse.default.timelineData).then((finalData) => {
            return res.status(200).json({
                searchTerm: keyword.toUpperCase(),
                resultTimeFrame: frame,
                timelineData: finalData
            });
        });
    });
});


app.listen(PORT, () => console.log('Running on :', PORT))


