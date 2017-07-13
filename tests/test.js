var iHeartRadioWebApi = require('../src/server.js');

var myHeartRadioApi = new iHeartRadioWebApi({
        host:  process.env.host,
        deviceId:  process.env.deviceId,
        deviceName:  process.env.deviceName,
        apikey:  process.env.apikey
    });

myHeartRadioApi.login('heretse@yahoo.com.tw', 'abcd1234', (err, result) => {
    if (!err) {
        console.log(JSON.stringify(result));
    }
});

myHeartRadioApi.getTrackByTrackId('634146', (err, result) => {
    if (!err) {
        console.log(JSON.stringify(result));
    }
});