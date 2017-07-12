'use strict';

var https = require("follow-redirects").https,
    urllib = require("url"),
    WebApiError = require('./webapi-error');

var DEFAULT_HOST = "https://api2.iheart.com/api/v1";

var HttpManager = {};

/* Create superagent options from the base request */
var _getParametersFromRequest = function (request) {

    var options = {};

    if (request.getQueryParameters()) {
        options.query = request.getQueryParameters();
    }

    if (request.getHeaders() &&
        request.getHeaders()['Content-Type'] === 'application/json') {
        options.data = JSON.stringify(request.getBodyParameters());
    } else if (request.getBodyParameters()) {
        options.data = request.getBodyParameters();
    }

    if (request.getHeaders()) {
        options.headers = request.getHeaders();
    }

    return options;
};

/* Create an error object from an error returned from the Web API */
var _getErrorObject = function (defaultMessage, err) {
    var errorObject;
    if (typeof err.error === 'object' && typeof err.error.message === 'string') {
        // Web API Error format
        errorObject = new WebApiError(err.error.message, err.error.status);
    } else if (typeof err.error === 'string') {
        // Authorization Error format
        /* jshint ignore:start */
        errorObject = new WebApiError(err.error + ': ' + err['error_description']);
        /* jshint ignore:end */
    } else if (typeof err === 'string') {
        // Serialized JSON error
        try {
            var parsedError = JSON.parse(err);
            errorObject = new WebApiError(parsedError.error.message, parsedError.error.status);
        } catch (err) {
            // Error not JSON formatted
        }
    }

    if (!errorObject) {
        // Unexpected format
        errorObject = new WebApiError(defaultMessage + ': ' + JSON.stringify(err));
    }

    return errorObject;
};

/* Make the request to the Web API */
HttpManager._makeRequest = function (method, payload, uri, callback) {
    
    if (!payload) {
        payload = {headers:{}, query:{}, data:{}};
    }

    // var reqTimeout = parseInt(RED.settings.httpRequestTimeout) || 120000;
    var reqTimeout = 120000;

    var opts = urllib.parse(uri);
    opts.port = 443;
    opts.method = method;
    opts.headers = payload.headers;

    for (var key in payload.query) {
        opts.headers[key] = payload.query[key];
    }

    var rawPayload;
    for (var key in payload.data) {
        if (!rawPayload) {
            rawPayload = "1=1";
        }

        rawPayload += "&" + key + "=" + payload.data[key];
    }

    if (opts.headers['content-length'] == null) {
        if (Buffer.isBuffer(rawPayload)) {
            opts.headers['content-length'] = rawPayload.length;
        } else {
            opts.headers['content-length'] = Buffer.byteLength(rawPayload);
        }
    }

    var req = https.request(opts, function(res) {
        res.setEncoding('utf8');
        
        var body = "";

        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            try {
                body = JSON.parse(body);
            } catch (e) {
                console.error("JSON format error");
            }

            return callback(null, {
                body: body,
                headers: res.headers,
                statusCode: res.statusCode
            });

        });
    });

    req.setTimeout(reqTimeout, function() {
        req.abort();
        var errorObject = _getErrorObject('Request timeout', {
                error: null
        });
        return callback(errorObject);
    });

    req.on('error', function(err) {
        if (err) {
            var errorObject = _getErrorObject('Request error', {
                error: err
            });
            return callback(errorObject);
        }
    });
    
    if (rawPayload) {
        req.write(rawPayload);
    }
    
    req.end();

};

/**
 * Make a HTTP GET request.
 * @param {BaseRequest} The request.
 * @param {Function} The callback function.
 */
HttpManager.get = function (request, callback) {
    var options = _getParametersFromRequest(request);

    HttpManager._makeRequest('GET', options, request.getURI(), callback);
};

/**
 * Make a HTTP POST request.
 * @param {BaseRequest} The request.
 * @param {Function} The callback function.
 */
HttpManager.post = function (request, callback) {
    var options = _getParametersFromRequest(request);

    HttpManager._makeRequest('POST', options, request.getURI(), callback);
};


module.exports = HttpManager;