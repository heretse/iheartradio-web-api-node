'use strict';

var HttpManager = require('./http-manager.js'),
    WebApiRequest = require('./webapi-request');

function iHeartRadioWebApi(credentials) {
    this._credentials = credentials || {};
}

iHeartRadioWebApi.prototype = {

    _performRequest: function (method, request) {
        var promiseFunction = function (resolve, reject) {
            method(request, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        };
        return new Promise(promiseFunction);
    },
    
    setCredentials: function (credentials) {
        for (var key in credentials) {
            if (credentials.hasOwnProperty(key)) {
                this._credentials[key] = credentials[key];
            }
        }
    },

    getCredentials: function () {
        return this._credentials;
    },

    resetCredentials: function () {
        this._credentials = null;
    },

    setHost: function(host) {
        this._setCredential('host', host);
    },

    setDeviceId: function(deviceId) {
        this._setCredential('deviceId', deviceId);
    },

    setDeviceName: function(deviceName) {
        this._setCredential('deviceName', deviceName);
    },

    setApiKey: function(apikey) {
        this._setCredential('apikey', apikey);
    },

    _setCredential: function (credentialKey, value) {
        this._credentials = this._credentials || {};
        this._credentials[credentialKey] = value;
    },

    _getCredential: function (credentialKey) {
        if (!this._credentials) {
            return;
        } else {
            return this._credentials[credentialKey];
        }
    },

    _resetCredential: function (credentialKey) {
        if (!this._credentials) {
            return;
        } else {
            this._credentials[credentialKey] = null;
        }
    },

    /*
     *  Accounts
     */
    login: function(userNameOrEmail, password, callback) {

        var actualCallback = callback;
        var actualOptions = {};

        if (this._credentials) {
            for (var key in this._credentials) {
                actualOptions[key] = this._credentials[key];
            }
        }

        actualOptions['userName'] = userNameOrEmail;
        actualOptions['password'] = password;

        var request = WebApiRequest.builder()
            .withPath('/api/v1/account/login')
            .withHeaders({"Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded"})
            .withBodyParameters(actualOptions)
            .build();

        var promise = this._performRequest(HttpManager.post, request);

        if (actualCallback) {
            promise.then(function (data) {
                actualCallback(null, data);
            }, function (err) {
                actualCallback(err);
            });
        } else {
            return promise;
        }
    },

    /*
     *  Custom Radio
     */
    getTrackByTrackId: function(trackId, callback) {
        
        var actualCallback = callback;
        var actualOptions = {};

        if (this._credentials) {
            for (var key in this._credentials) {
                actualOptions[key] = this._credentials[key];
            }
        }

        actualOptions['trackId'] = trackId;

        var request = WebApiRequest.builder()
            .withPath('/api/v1/catalog/getTrackByTrackId')
            .withHeaders({"Accept": "application/json"})
            .withQueryParameters(actualOptions)
            .build();

        var promise = this._performRequest(HttpManager.get, request);

        if (actualCallback) {
            promise.then(function (data) {
                actualCallback(null, data);
            }, function (err) {
                actualCallback(err);
            });
        } else {
            return promise;
        }
    }
};

module.exports = iHeartRadioWebApi;