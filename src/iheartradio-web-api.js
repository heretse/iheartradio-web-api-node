'use strict';

var HttpManager = require('./http-manager.js'),
    WebApiRequest = require('./webapi-request');

const GET_COMMON_HEADERS = {"Accept": "application/json"};
const POST_COMMON_HEADERS = {"Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded"};

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
            .withHeaders(POST_COMMON_HEADERS)
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
            .withHeaders(GET_COMMON_HEADERS)
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
    },
    
    getArtistByArtistId: function(artistId, includeBio, callback) {

        var actualIncludeBio = false;
        var actualCallback;

        if (typeof includeBio === 'function') {
            actualCallback = includeBio;
        } else {
            actualIncludeBio = includeBio;
            actualCallback = callback;
        }

        var actualOptions = {};

        if (this._credentials) {
            for (var key in this._credentials) {
                actualOptions[key] = this._credentials[key];
            }
        }

        actualOptions['artistId'] = artistId;
        actualOptions['includeBio'] = actualIncludeBio;

        var request = WebApiRequest.builder()
            .withPath('/api/v1/catalog/getArtistByArtistId')
            .withHeaders(GET_COMMON_HEADERS)
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
    },

    getSimilar: function(artistId, callback) {
        
        var actualCallback = callback;
        var actualOptions = {};

        if (this._credentials) {
            for (var key in this._credentials) {
                actualOptions[key] = this._credentials[key];
            }
        }

        var request = WebApiRequest.builder()
            .withPath('/api/v1/catalog/artist/' + artistId + '/getSimilar')
            .withHeaders(GET_COMMON_HEADERS)
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
    },

    getTracks: function(artistId, callback) {
        
        var actualCallback = callback;
        var actualOptions = {};

        if (this._credentials) {
            for (var key in this._credentials) {
                actualOptions[key] = this._credentials[key];
            }
        }

        var request = WebApiRequest.builder()
            .withPath('/api/v1/catalog/artist/' + artistId + '/getTracks')
            .withHeaders(GET_COMMON_HEADERS)
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
    },

    getAlbumsByCategories: function(categoryId, options, callback) {

        var actualCallback;

        if (typeof options === 'function') {
            actualCallback = options;
        } else {
            actualCallback = callback;
        }

        var actualOptions = {};

        if (this._credentials) {
            for (var key in this._credentials) {
                actualOptions[key] = this._credentials[key];
            }
        }

        actualOptions['categoryId'] = categoryId;
        if (options.startIndex) {
            actualOptions['startIndex'] = options.startIndex;
        }
        if (options.maxRows) {
            actualOptions['maxRows'] = options.maxRows;
        }

        var request = WebApiRequest.builder()
            .withPath('/api/v1/catalog/getAlbumsByCategories')
            .withHeaders(GET_COMMON_HEADERS)
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
    },

    getArtistsByCategories: function(categoryId, options, callback) {

        var actualCallback;

        if (typeof options === 'function') {
            actualCallback = options;
        } else {
            actualCallback = callback;
        }

        var actualOptions = {};

        if (this._credentials) {
            for (var key in this._credentials) {
                actualOptions[key] = this._credentials[key];
            }
        }

        actualOptions['categoryId'] = categoryId;
        if (options.startIndex) {
            actualOptions['startIndex'] = options.startIndex;
        }
        if (options.maxRows) {
            actualOptions['maxRows'] = options.maxRows;
        }

        var request = WebApiRequest.builder()
            .withPath('/api/v1/catalog/getArtistsByCategories')
            .withHeaders(GET_COMMON_HEADERS)
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
    },

    getTracksByCategories: function(categoryId, options, callback) {
        
        var actualCallback;

        if (typeof options === 'function') {
            actualCallback = options;
        } else {
            actualCallback = callback;
        }

        var actualOptions = {};

        if (this._credentials) {
            for (var key in this._credentials) {
                actualOptions[key] = this._credentials[key];
            }
        }

        actualOptions['categoryId'] = categoryId;
        if (options.startIndex) {
            actualOptions['startIndex'] = options.startIndex;
        }
        if (options.maxRows) {
            actualOptions['maxRows'] = options.maxRows;
        }

        var request = WebApiRequest.builder()
            .withPath('/api/v1/catalog/getTracksByCategories')
            .withHeaders(GET_COMMON_HEADERS)
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
    },

    getAlbumsByAlbumIds: function(albumId, options, callback) {

        var actualCallback;

        if (typeof options === 'function') {
            actualCallback = options;
        } else {
            actualCallback = callback;
        }

        var actualOptions = {};

        if (this._credentials) {
            for (var key in this._credentials) {
                actualOptions[key] = this._credentials[key];
            }
        }

        actualOptions['albumId'] = albumId;
        if (options.startIndex) {
            actualOptions['startIndex'] = options.startIndex;
        }
        if (options.maxRows) {
            actualOptions['maxRows'] = options.maxRows;
        }

        var request = WebApiRequest.builder()
            .withPath('/api/v1/catalog/getAlbumsByAlbumIds')
            .withHeaders(GET_COMMON_HEADERS)
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
    },

    getTopSongsByGenre: function(genreId, options, callback) {

        var actualCallback;

        if (typeof options === 'function') {
            actualCallback = options;
        } else {
            actualCallback = callback;
        }

        var actualOptions = {};

        if (this._credentials) {
            for (var key in this._credentials) {
                actualOptions[key] = this._credentials[key];
            }
        }

        actualOptions['genreId'] = genreId;
        if (options.startIndex) {
            actualOptions['startIndex'] = options.startIndex;
        }
        if (options.maxRows) {
            actualOptions['maxRows'] = options.maxRows;
        }

        var request = WebApiRequest.builder()
            .withPath('/api/v1/catalog/getTopSongsByGenre')
            .withHeaders(GET_COMMON_HEADERS)
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
    },

    getFeaturedMoodStations: function(callback) {

        var actualCallback;

        if (typeof options === 'function') {
            actualCallback = options;
        } else {
            actualCallback = callback;
        }

        var actualOptions = {};

        if (this._credentials) {
            for (var key in this._credentials) {
                actualOptions[key] = this._credentials[key];
            }
        }

        var request = WebApiRequest.builder()
            .withPath('/api/v1/catalog/getFeaturedMoodStations')
            .withHeaders(GET_COMMON_HEADERS)
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
    },

    getFeaturedStationById: function(stationId, callback) {

        var actualCallback;

        if (typeof options === 'function') {
            actualCallback = options;
        } else {
            actualCallback = callback;
        }

        var actualOptions = {};

        if (this._credentials) {
            for (var key in this._credentials) {
                actualOptions[key] = this._credentials[key];
            }
        }

        actualOptions['id'] = stationId;

        var request = WebApiRequest.builder()
            .withPath('/api/v1/catalog/getFeaturedStationById')
            .withHeaders(GET_COMMON_HEADERS)
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
    },

    getFeaturedStationBySlug: function(slug, callback) {

        var actualCallback;

        if (typeof options === 'function') {
            actualCallback = options;
        } else {
            actualCallback = callback;
        }

        var actualOptions = {};

        if (this._credentials) {
            for (var key in this._credentials) {
                actualOptions[key] = this._credentials[key];
            }
        }

        actualOptions['slug'] = slug;

        var request = WebApiRequest.builder()
            .withPath('/api/v1/catalog/getFeaturedStationBySlug')
            .withHeaders(GET_COMMON_HEADERS)
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
    },

    searchTrack: function(keywords, options, callback) {
        
        var actualCallback;

        if (typeof options === 'function') {
            actualCallback = options;
        } else {
            actualCallback = callback;
        }

        var actualOptions = {};

        if (this._credentials) {
            for (var key in this._credentials) {
                actualOptions[key] = this._credentials[key];
            }
        }

        actualOptions['keywords'] = keywords;

        if (options.maxRows) {
            actualOptions['maxRows'] = options.maxRows;
        }

        var request = WebApiRequest.builder()
            .withPath('/api/v1/catalog/searchTrack')
            .withHeaders(GET_COMMON_HEADERS)
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
    },

    searchArtist: function(keywords, options, callback) {

        var actualCallback;

        if (typeof options === 'function') {
            actualCallback = options;
        } else {
            actualCallback = callback;
        }

        var actualOptions = {};

        if (this._credentials) {
            for (var key in this._credentials) {
                actualOptions[key] = this._credentials[key];
            }
        }

        actualOptions['keywords'] = keywords;
        
        if (options.genreId) {
            actualOptions['genreId'] = options.genreId;
        }
        if (options.vendorGenreId) {
            actualOptions['vendorGenreId'] = options.vendorGenreId;
        }
        if (options.startIndex) {
            actualOptions['startIndex'] = options.startIndex;
        }
        if (options.maxRows) {
            actualOptions['maxRows'] = options.maxRows;
        }

        var request = WebApiRequest.builder()
            .withPath('/api/v1/catalog/searchArtist')
            .withHeaders(GET_COMMON_HEADERS)
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
    },

    searchAlbum: function(keywords, options, callback) {

        var actualCallback;

        if (typeof options === 'function') {
            actualCallback = options;
        } else {
            actualCallback = callback;
        }

        var actualOptions = {};

        if (this._credentials) {
            for (var key in this._credentials) {
                actualOptions[key] = this._credentials[key];
            }
        }

        actualOptions['keywords'] = keywords;

        if (options.genreId) {
            actualOptions['genreId'] = options.genreId;
        }
        if (options.vendorGenreId) {
            actualOptions['vendorGenreId'] = options.vendorGenreId;
        }
        if (options.startIndex) {
            actualOptions['startIndex'] = options.startIndex;
        }
        if (options.maxRows) {
            actualOptions['maxRows'] = options.maxRows;
        }

        var request = WebApiRequest.builder()
            .withPath('/api/v1/catalog/searchAlbum')
            .withHeaders(GET_COMMON_HEADERS)
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
    },

    searchFeaturedStation: function(keywords, options, callback) {

        var actualCallback;

        if (typeof options === 'function') {
            actualCallback = options;
        } else {
            actualCallback = callback;
        }

        var actualOptions = {};

        if (this._credentials) {
            for (var key in this._credentials) {
                actualOptions[key] = this._credentials[key];
            }
        }

        actualOptions['keywords'] = keywords;

        if (options.maxRows) {
            actualOptions['maxRows'] = options.maxRows;
        }

        var request = WebApiRequest.builder()
            .withPath('/api/v1/catalog/searchFeaturedStation')
            .withHeaders(GET_COMMON_HEADERS)
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
    },

    searchStation: function(keywords, options, callback) {

        var actualCallback;

        if (typeof options === 'function') {
            actualCallback = options;
        } else {
            actualCallback = callback;
        }

        var actualOptions = {};

        if (this._credentials) {
            for (var key in this._credentials) {
                actualOptions[key] = this._credentials[key];
            }
        }

        actualOptions['keywords'] = keywords;

        if (options.maxRows) {
            actualOptions['maxRows'] = options.maxRows;
        }

        var request = WebApiRequest.builder()
            .withPath('/api/v1/catalog/searchStation')
            .withHeaders(GET_COMMON_HEADERS)
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
    },

    searchAll: function(keywords, options, callback) {
        var actualCallback;

        if (typeof options === 'function') {
            actualCallback = options;
        } else {
            actualCallback = callback;
        }

        var actualOptions = {};

        if (this._credentials) {
            for (var key in this._credentials) {
                actualOptions[key] = this._credentials[key];
            }
        }

        actualOptions['keywords'] = keywords;

        if (options.maxRows) {
            actualOptions['maxRows'] = options.maxRows;
        }
        if (options.queryArtist) {
            actualOptions['queryArtist'] = 'true';
        } else {
            actualOptions['queryArtist'] = 'false';
        }
        if (options.queryArtist) {
            actualOptions['queryBundle'] = 'true';
        } else {
            actualOptions['queryBundle'] = 'false';
        }
        if (options.queryArtist) {
            actualOptions['queryStation'] = 'true';
        } else {
            actualOptions['queryStation'] = 'false';
        }
        if (options.queryArtist) {
            actualOptions['queryArtist'] = 'true';
        } else {
            actualOptions['queryArtist'] = 'false';
        }
        if (options.queryArtist) {
            actualOptions['queryFeauredStation'] = 'true';
        } else {
            actualOptions['queryFeauredStation'] = 'false';
        }
        if (options.queryArtist) {
            actualOptions['queryTalkShow'] = 'true';
        } else {
            actualOptions['queryTalkShow'] = 'false';
        }
        if (options.queryArtist) {
            actualOptions['queryTalkTheme'] = 'true';
        } else {
            actualOptions['queryTalkTheme'] = 'false';
        }

        var request = WebApiRequest.builder()
            .withPath('/api/v1/catalog/searchAll')
            .withHeaders(GET_COMMON_HEADERS)
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