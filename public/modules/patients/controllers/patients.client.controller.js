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


angular.module('patients').controller('PatientListController', ['$scope', '$stateParams', '$location', 'Authentication', 'Patients', '$log', '$state',
    function ($scope, $stateParams, $location, Authentication, Patients, $log, $state) {
        $scope.authentication = Authentication;


        // Remove existing Patient
        $scope.remove = function (patientId) {
            if (patientId) {
                Patients.delete(
                    { patientId: patientId},
                    function (response) {
                        for (var i in $scope.patients) {
                            if ($scope.patients[i].id === patientId) {
                                $scope.patients.splice(i, 1);
                                break;
                            }
                        }
                        $location.path('/patients');
                        //Reloading the current state
                        $state.forceReload();

                    },
                    function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                    }
                );
            }else {
                $log.error("No patient Id specified");
            }
        };

        // Find a list of Patients
        $scope.find = function () {
            $scope.patients = Patients.query();

//            var patientList = [];

//            if(!angular.isArray(loadedPatients)){
//                patientList.push(loadedPatients);
//                $scope.toggleDemographicMode(true);
//            }else{
//                $scope.toggleDemographicMode(false);
//                patientList = loadedPatients;
//            }

    //      Initial table page size
            $scope.pageSize = 10;

//            $scope.patients = patientList;
            $scope.filteredPatients = $scope.patients;
            $scope.totalRecords = $scope.patients.length;

            //Calculating the the size of the shown page
            $scope.showPageSize = $scope.pageSize > $scope.totalRecords ? $scope.totalRecords : $scope.pageSize;

            //Calcating the first record
            $scope.startRecord = 1;
        };


        // Find existing Patient
        $scope.findOne = function () {
            $scope.patient = Patients.get({
                patientId: $stateParams.patientId
            });
        };


        //ORIGINAL BHAM CODE

        var successCallback =  function(data){
            $log.info("Success in processing the request...");
            $scope.redirect('/patients');
        };

        var errorCallback = function(error){
            $log.error(error.data.message );
            $location.search("message",error.data.message );
            $scope.redirect('/error');
        };

        //Refreshing table by making the first page the current page
        var refreshTable = function(){
            $scope.setActivePage(0);
        };

        $scope.onSearch = function(){
            //In case of search resetting the page number to the first page
            $scope.pageNo = 0;

            if(angular.isDefined($scope.searchBy) && ( $scope.searchBy.length > 0) ){
                if($scope.searchBy === 'administrativeGenderCodeDisplayName'){
                    $scope.composedCriteria = {administrativeGenderCodeDisplayName : "" + $scope.criteria};
                }else if($scope.searchBy === 'addressPostalCode'){
                    $scope.composedCriteria = {addressPostalCode : $scope.criteria};
                }
            }else{
                $scope.composedCriteria = $scope.criteria;
            }
        };


        $scope.onPageSizeChange = function(){
            if( $scope.pageSize > $scope.totalRecords) {
                $scope.showPageSize = $scope.filteredPatients.length;
            }else{
                $scope.showPageSize = $scope.pageSize ;
            }
            //On changing page size reset to first page and set the page number to 0
            $scope.startRecord = 1;
            $scope.pageNo = 0;
        };

        //SORTING
        $scope.sortField = undefined;
        $scope.reverse = false;

        $scope.sort = function (fieldName) {
            if ($scope.sortField === fieldName) {
                $scope.reverse = !$scope.reverse;
            } else {
                $scope.sortField = fieldName;
                $scope.reverse = false;
            }
        };

        $scope.isSortUp = function (fieldName) {
            return $scope.sortField === fieldName && !$scope.reverse;
        };

        $scope.isSortDown = function (fieldName) {
            return $scope.sortField === fieldName && $scope.reverse;
        };

        // PAGINATION
        $scope.pages = [];
        $scope.pageNo = 0;
        $scope.firstPage = 0;
        $scope.lastPage = 0;

        var calculatePaginationPages = function(numberPatients, pageSize){
            $scope.pages.length = 0;
            var noOfPages = Math.ceil(numberPatients / pageSize);
            $scope.lastPage = noOfPages;
            for (var i=0; i<noOfPages; i++) {
                $scope.pages.push(i);
            }

        };

        $scope.$watch('filteredPatients.length', function(filteredSize){
            calculatePaginationPages(filteredSize,$scope.pageSize );

            //Update showPageSize when filteredPatient length changes
            $scope.startRecord = parseInt($scope.pageSize) * parseInt( $scope.pageNo) + 1;
            var upperLimit = $scope.startRecord  + parseInt($scope.pageSize) - 1;
            $scope.showPageSize = upperLimit > filteredSize? filteredSize  : upperLimit;

        });

        $scope.$watch('pageSize', function(newPageSize){
            var totalPatient = 0;
            if(angular.isDefined($scope.filteredPatients)){
                totalPatient = $scope.filteredPatients.length;
            }else if(angular.isDefined($scope.totalRecords)){
                totalPatient = $scope.totalRecords.length;
            }
            calculatePaginationPages( totalPatient , newPageSize);
            //Reset current to first page after user changes the page size.
            $scope.pageNo = 0;
        });

        $scope.setActivePage = function (pageNo) {
            if (pageNo >=0 && pageNo < $scope.pages.length) {
                $scope.pageNo = pageNo;
                // Updating showing pages
                updateShowPageSize(pageNo);
            }
        };

        var updateShowPageSize = function(pageNo){
            // Updating showing pages
            $scope.startRecord = parseInt($scope.pageSize) * parseInt( pageNo) + 1;
            var upperLimit = $scope.startRecord  + parseInt($scope.pageSize) - 1;
            var filteredpatientslenght = $scope.filteredPatients.length;
            $scope.showPageSize = upperLimit > filteredpatientslenght ? filteredpatientslenght  : upperLimit;
        };
    }
]);


angular.module('patients').controller('PatientCreateController', ['$scope', '$stateParams', '$location', 'Authentication', 'Patients', '$log', '$state',
    function ($scope, $stateParams, $location, Authentication, Patients, $log, $state) {
        $scope.authentication = Authentication;

//        $scope.states = loadedData[0];
//        $scope.races = loadedData[1];
//
//        //CRUD OPERATION
//        var successCallback =  function(data){
//            //TODO Show success to user => notification
//            $log.info("Success in processing the request...");
//            $scope.redirect('/patients');
//        };
//
//        var errorCallback = function(error){
//            $log.error(error.data.message );
//            $location.search("message",error.data.message );
//            $scope.redirect('/error');
//        };
//
//        $scope.save = function(patient){
//            PatientService.create(patient,successCallback,errorCallback);
//        };
//
//        // Create patient
//        $scope.showErrorOnCreate = function(ngModelController, error) {
//            return ngModelController.$error[error];
//        };
//
//        $scope.canSave = function() {
//            return $scope.patientForm.$dirty && $scope.patientForm.$valid && !$scope.showCompareDateError ;
//        };
//
//        $scope.showCompareDateError = false;
//
//        $scope.$watch('patient.birthDate', function(birthdate){
//            $scope.showCompareDateError = $scope.isFutureDate(birthdate);
//        });


    }
]);