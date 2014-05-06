'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Patient = mongoose.model('Patient'),
    _ = require('lodash');

var http = require('http');

var getErrorMessage = function (err) {
    var message = '';

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Patient already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message;
        }
    }

    return message;
};

exports.create = function (req, res) {
    var patient = req.body;
    var jsonPatient = JSON.stringify(req.body);

    var postheaders = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(jsonPatient, 'utf8')
    };

    var options = {
        host: 'bhamdevtest001',
        port: 8087,
        path: '/bham/patients',
        method: 'POST',
        headers: postheaders
    };

    var reqPost = http.request(options, function (result) {
        result.on('data', function (d) {
        });
        result.on('end', function () {
            res.end();
        });
    });

    reqPost.write(jsonPatient);
    reqPost.end();
    reqPost.on('error', function (e) {
        console.error(e);
    });
};

exports.read = function (req, res) {
    console.log('opopo' + req.patientId);

    var options = {
        host: 'bhamdevtest001',
        port: 8087,
        path: '/bham/patients/' + req.patientId,
        method: 'GET'
    };

    var reqGet = http.get(options, function (result) {
        result.on('data', function (d) {
            console.info('GET result:\n');
            process.stdout.write(d);
            console.info('\n\nCall completed');
            res.write(d);
        });
        result.on('end', function () {
            res.end();
        });
    });

    reqGet.end();
    reqGet.on('error', function (e) {
        console.error(e);
    });
};

exports.update = function (req, res) {
    var patient = req.body;
    var jsonPatient = JSON.stringify(req.body);
    var postheaders = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(jsonPatient, 'utf8')
    };

    var options = {
        host: 'bhamdevtest001',
        port: 8087,
        path: '/bham/patients/' + patient.id,
        method: 'PUT',
        headers: postheaders
    };

    var reqPost = http.request(options, function (result) {
        result.on('data', function (d) {
            console.info('Post result:\n');
            //process.stdout.write(d);
            console.info('\n\nCall completed');
            //res.write(d);

        });
        result.on('end', function () {
            res.end();
        });
    });

    reqPost.write(jsonPatient);
    reqPost.end();
    reqPost.on('error', function (e) {
        console.error(e);
    });

};

exports.delete = function (req, res) {
    var postheaders = {
        'Content-Type': 'application/json'
    };

    var options = {
        host: 'bhamdevtest001',
        port: 8087,
        path: '/bham/patients/' + req.patientId,
        method: 'DELETE',
        headers: postheaders
    };

    var reqPost = http.request(options, function (result) {
        result.on('data', function (d) {
            console.info('Post result:\n');
            console.info('\n\nCall completed');
        });
        result.on('end', function () {
            res.end();
        });
    });
    reqPost.end();
    reqPost.on('error', function (e) {
        console.error(e);
    });
};

/**
 * List of Patients
 */
exports.list = function (req, res) {
    var options = {
        host: 'bhamdevtest001',
        port: 8087,
        path: '/bham/patients',
        method: 'GET'
    };

    var reqGet = http.get(options, function (result) {
        result.on('data', function (d) {
            console.info('GET result:\n');
            //process.stdout.write(d);
            console.info('\n\nCall completed');
            res.write(d);
        });
        result.on('end', function () {
            res.end();
        });
    });

    reqGet.end();
    reqGet.on('error', function (e) {
        console.error(e);
    });
};

exports.patientByID = function (req, res, next, id) {
    req.patientId = id;
    next();
};

exports.hasAuthorization = function (req, res, next) {
    if (req.patient.user.id !== req.user.id) {
        return res.send(403, 'User is not authorized');
    }
    next();
};