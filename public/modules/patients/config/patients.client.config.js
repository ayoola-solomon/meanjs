'use strict';

// Configuring the Articles module
angular.module('patients').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Patients', 'patients');
		Menus.addMenuItem('topbar', 'New Patient', 'patients/create');
	}
]);