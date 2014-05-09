/**
 * Created by tomson.ngassa on 5/9/14.
 */

'use strict';

angular.module("core")

.directive("deletePatient", function () {
    return {
        restrict: 'E',
        scope: {
            patientid: '@',
            name: '@',
            ondelete: '&'
        },
        template: '<a class="red" href="#">' +
            '<i class="icon-trash bigger-130"></i>' +
            '</a>',
        link: function (scope, element, attrs) {

            element.on('click', function (e) {
                e.preventDefault();
                var msg = 'Patient <b>' + scope.name + '</b> will be permanently deleted and cannot be recovered.';
                $('#dialog-confirm-msg').html(msg);
                $("#dialog-confirm").removeClass('hide').dialog({
                    resizable: false,
                    modal: true,
                    title: 'Delete patient',
                    title_html: true,
                    buttons: [
                        {
                            html: "<i class='icon-trash bigger-110'></i>&nbsp; Delete patient",
                            "class": "btn btn-danger btn-xs",
                            click: function () {
                                scope.ondelete({patientId: scope.patientid});
                                $(this).dialog("close");
                            }
                        },
                        {
                            html: "<i class='icon-remove bigger-110'></i>&nbsp; Cancel",
                            "class": "btn btn-xs",
                            click: function () {
                                $(this).dialog("close");
                            }
                        }
                    ]
                });
            });
        }
    };
})

.directive("showPatient", function () {
    return {
        restrict: 'E',
        scope: {
            patient: '='
        },
        template: '<a class="blue" href="#">' +
            '<i class="icon-zoom-in bigger-130"></i>' +
            '</a>',
        link: function (scope, element, attrs) {

            element.on('click', function (e) {
                e.preventDefault();

                var selectedPatient = scope.patient;
                var mrn = selectedPatient.medicalRecordNumber !== null ? selectedPatient.medicalRecordNumber : '';
                var fullName = selectedPatient.fullName !== null ? selectedPatient.fullName : '';
                var gender = selectedPatient.administrativeGenderCodeDisplayName !== null ? selectedPatient.administrativeGenderCodeDisplayName : '';
                var raceDisplayName = selectedPatient.raceCodeDisplayName !== null ? selectedPatient.raceCodeDisplayName : '';
                var dob = selectedPatient.birthDate !== null ? selectedPatient.birthDate : '';
                var zipcode = selectedPatient.addressPostalCode !== null ? selectedPatient.addressPostalCode : '';
                var state = selectedPatient.addressStateCode !== null ? selectedPatient.addressStateCode : '';


                var patientDetails = '<div class="row">' +
                    '<div class="col-xs-12">' +
                    '<div class="table-responsive">' +
                    '<div class="modal-body no-padding" >' +
                    ' <table  class="table table-striped table-bordered table-hover no-bottom-margin">' +
                    '  <tbody>' +
                    ' <tr > <td  class="captionID" >  <b>Patient ID</b> </td> <td class="dataID"> '+ mrn + ' </td></tr>' +
                    ' <tr > <td  class="captionID" >  <b>Full Name</b> </td> <td class="dataID"> '+ fullName + ' </td></tr>' +
                    ' <tr > <td  class="captionID" >  <b>Gender</b> </td> <td class="dataID"> '+ gender + ' </td></tr>' +
                    ' <tr > <td  class="captionID" >  <b>Race</b> </td> <td class="dataID"> '+ raceDisplayName + ' </td></tr>' +
                    ' <tr > <td  class="captionID" >  <b>DOB</b> </td> <td class="dataID"> '+ dob + ' </td></tr>' +
                    ' <tr > <td  class="captionID" >  <b>Zicode</b> </td> <td class="dataID"> '+ zipcode + ' </td></tr>' +
                    ' <tr > <td  class="captionID" >  <b>State</b> </td> <td class="dataID"> '+ state + ' </td></tr>' +
                    '  </tbody>' +
                    ' </table>' +
                    ' </div>' +
                    ' </div>' +
                    ' </div>' +
                    ' </div>' ;
                $('#dialog-patient-details').html(patientDetails);
                $("#dialog-patient-details").removeClass('hide').dialog({
                    resizable: false,
                    modal: true,
                    title: 'Patient details',
                    title_html: true,
                    width:400
                });
            });
        }
    };
})  ;
