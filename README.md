# iheartradio-web-api-node

## Overview

A Node.js wrapper for iHeartRadio's Web API

##

# Get Started

## Install API module
```
npm install https://github.com/heretse/iheartradio-web-api-node.git

```

## Init API module

Example looks like:
```
var myHeartRadioApi = new iHeartRadioWebApi({
        host:  'YOUR_HOST',
        deviceId:  'YOUR_DEVICE_ID',
        deviceName:  'YOUR_DEVICE_NAME',
        apikey:  'YOUR_API_KEY'
    });

```

## Using API module with promise object

Example looks like:
```
var searchPromise = myHeartRadioApi.searchAll("gorillaz*", {maxRows:5, queryArtist:true, queryBundle:true, queryStation:true, queryArtist:true});

searchPromise.then(function(result) {
    console.log(result); // "Stuff worked!"
}, function(err) {
    console.log(err); // Error: "It broke"
});

```

## Using API module with callback function

Example looks like:
```

myHeartRadioApi.searchAll("gorillaz*", {maxRows:5, queryArtist:true, queryBundle:true, queryStation:true, queryArtist:true}, (err, result) => {
    if (!err) {
        console.log(result);
    }
});

```