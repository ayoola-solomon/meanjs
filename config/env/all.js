'use strict';

module.exports = {
	app: {
		title: 'BHAM',
		description: 'y',
		keywords: 'y'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
//				'public/lib/bootstrap/dist/css/bootstrap.css',
//				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
//                'public/lib/nvd3/nv.d3.css'
			],
			js: [
                'public/lib/jquery/dist/jquery.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js',  
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/angular-tree-control/angular-tree-control.js',
                'public/lib/d3/d3.js',
                'public/lib/nvd3/nv.d3.js',
                'public/lib/angularjs-nvd3-directives/dist/angularjs-nvd3-directives.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};