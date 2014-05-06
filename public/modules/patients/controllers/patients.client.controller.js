'use strict';

// Patients controller
angular.module('patients').controller('PatientsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Patients',
    function ($scope, $stateParams, $location, Authentication, Patients) {
        $scope.authentication = Authentication;

        // Create new Patient
        $scope.create = function () {
            // Create new Patient object
            Patients.save(
                $scope.patient,
                function (response) {
                    $location.path('patients');
                },
                function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                }
            );
        };

        // Remove existing Patient
        $scope.remove = function (patient) {

            console.log('Before delete: ' + patient.id);
            if (patient) {
                console.log('Inside delete');
                Patients.delete(
                    { patientId: patient.id },
                    function (response) {

                        for (var i in $scope.patients) {
                            if ($scope.patients[i] === patient) {
                                $scope.patients.splice(i, 1);
                            }
                        }

                        $location.path('patients');
                    },
                    function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                    }
                );


            }
        };

        // Update existing Patient
        $scope.update = function () {
            console.log('Patient ID: ' + $scope.patient.id);

            Patients.update(
                { patientId: $scope.patient.id },
                $scope.patient,
                function (response) {
                    $location.path('patients');
                },
                function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                }
            );
        };

        // Find a list of Patients
        $scope.find = function () {
            $scope.patients = Patients.query();
        };

        // Find existing Patient
        $scope.findOne = function () {
            $scope.patient = Patients.get({
                patientId: $stateParams.patientId
            });
        };
    }
]);