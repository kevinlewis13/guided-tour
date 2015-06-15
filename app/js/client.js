'use strict';

require('angular/angular');

var toursApp = angular.module('toursApp', []);

//services
require('./services/rest_resource.js')(toursApp);

//controllers
require('./controllers/tours_controller.js')(toursApp);

//directives
// require('./directives/simple_directive.js')(toursApp);
// require('./tours/directives/route_form_directive.js')(toursApp);
