'use strict';

require('angular/angular');
require('angular-route');

var toursApp = angular.module('toursApp', [ 'ngRoute' ]);

//services
require('./services/rest_resource.js')(toursApp);

//controllers
require('./controllers/hello_controller.js')(toursApp);
require('./controllers/tours_controller.js')(toursApp);
require('./controllers/make_tour_controller.js')(toursApp);

//directives
require('./directives/tour_list_directive.js')(toursApp); //Getting and showing our list of tours
require('./directives/nav_directive.js')(toursApp); //Showing the map to next stop
require('./directives/waypoint_info_directive.js')(toursApp); //showing info about a stop once user gets there

toursApp.config(['$routeProvider', function( $routeProvider ) {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/views/index_view.html',
      controller: 'helloController'
    })
    .when('/nearby', {
      templateUrl: 'templates/views/take_tour_view.html',
      controller: 'takeTourController'
    })
    .when('/create_tour', {
      templateUrl: 'templates/views/make_tour_view.html',
      controller: 'makeTourController'
    })
    .otherwise({
      redirectTo: '/'
    })
}]);
