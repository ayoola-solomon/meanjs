'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Patient = mongoose.model('Patient'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
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

/**
 * Create a Patient
 */
exports.create = function(req, res) {
	var patient = new Patient(req.body);
	patient.user = req.user;

	patient.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(patient);
		}
	});
};

/**
 * Show the current Patient
 */
exports.read = function(req, res) {
	res.jsonp(req.patient);
};

/**
 * Update a Patient
 */
exports.update = function(req, res) {
	var patient = req.patient;

	patient = _.extend(patient, req.body);

	patient.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(patient);
		}
	});
};

/**
 * Delete an Patient
 */
exports.delete = function(req, res) {
	var patient = req.patient;

	patient.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(patient);
		}
	});
};

/**
 * List of Patients
 */
exports.list = function(req, res) {
	Patient.find().sort('-created').populate('user', 'displayName').exec(function(err, patients) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(patients);
		}
	});
};

/**
 * Patient middleware
 */
exports.patientByID = function(req, res, next, id) {
	Patient.findById(id).populate('user', 'displayName').exec(function(err, patient) {
		if (err) return next(err);
		if (!patient) return next(new Error('Failed to load Patient ' + id));
		req.patient = patient;
		next();
	});
};

/**
 * Patient authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.patient.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};