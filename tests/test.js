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

myHeartRadioApi.getArtistByArtistId('39299', true, (err, result) => {
    if (!err) {
        console.log(JSON.stringify(result));
    }
});

myHeartRadioApi.getAlbumsByAlbumIds(5554141, {startIndex:0, maxRows:5}, (err, result) => {
    if (!err) {
        console.log(JSON.stringify(result));
    }
});

myHeartRadioApi.getTopSongsByGenre(987, {maxRows:2}, (err, result) => {
    if (!err) {
        console.log(JSON.stringify(result));
    }
});

myHeartRadioApi.searchTrack("shape of you", {maxRows:5}, (err, result) => {
    if (!err) {
        console.log(JSON.stringify(result));
    }
});

myHeartRadioApi.searchArtist("ed sheeran", {maxRows:5}, (err, result) => {
    if (!err) {
        console.log(JSON.stringify(result));
    }
});

myHeartRadioApi.searchAlbum("divide", {maxRows:5}, (err, result) => {
    if (!err) {
        console.log(JSON.stringify(result));
    }
});

myHeartRadioApi.searchFeaturedStation("chillax", {maxRows:5}, (err, result) => {
    if (!err) {
        console.log(JSON.stringify(result));
    }
});


myHeartRadioApi.searchStation("z100", {maxRows:5}, (err, result) => {
    if (!err) {
        console.log(JSON.stringify(result));
    }
});

myHeartRadioApi.searchAll("gorillaz*", {maxRows:5, queryArtist:true, queryBundle:true, queryStation:true, queryArtist:true}, (err, result) => {
    if (!err) {
        console.log(JSON.stringify(result));
    }
});
