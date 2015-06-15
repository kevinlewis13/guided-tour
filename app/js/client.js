'use strict';

require('angular/angular');

var toursApp = angular.module('toursApp', []);

//services
require('./services/rest_resource.js')(toursApp);

//controllers
require('./controllers/tours_controller.js')(toursApp);

//directives
require('./directives/tour_list_directive.js')(toursApp); //Getting and showing our list of tours
//require('./directives/nav_directive.js')(toursApp); //Showing the map to next stop
//require('./directives/waypoint_info_directive.js')(toursApp); //showing info about a stop once user gets there
