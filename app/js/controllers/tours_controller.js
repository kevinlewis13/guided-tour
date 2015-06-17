'use strict';

var geolib = require('geolib');

module.exports = function(app) { //app === an angular module
  app.controller('takeTourController', ['$scope', '$http', 'RESTResource' '$location', function($scope, $http, restResource, $location) {
    var Tour = restResource('tours');
    $scope.errors          = [];
    $scope.appState        = 'start';
    $scope.currentTour     = null;
    $scope.currentWaypoint = 0;
    $scope.tour            = [];
    $scope.tours           = [];
    $scope.currentPosition = {};

    $scope.geoOptions = {
      enableHighAccuracy: true,
      maximumAge: 8000
    };

    $scope.map;

    $scope.goHome = function() {
      $location.path('/');
    }

    $scope.loadMap = function() {
      $scope.map = L.map('map');
      $scope.getNearby();
    }

    $scope.attachImagesToMap = function() {
      L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data',
          maxZoom: 19
        }).addTo( $scope.map );
    };

    var marker;
    $scope.addMarker = function( map, position ) {
      L.marker([ position.latitude, position.longitude ], {
        title: 'Here!'
      }).addTo( map );
    };

    $scope.addLandmark = function( map, position, options ) {
      L.circle([ position[1], position[0] ], 10, {
        color: 'red',
        fill: '#fca'
      }).addTo( map );
    };

    $scope.handleGeoError = function( err ) {
      $scope.errors.push({ message: 'Could not get location', error: err });
      console.log( err );
    };

    $scope.getPosition = function( callback ) {
      if ( navigator.geolocation ) {
        navigator.geolocation.getCurrentPosition(function( position ) {
          if ( typeof callback === 'function' ) {
            callback( position.coords );
          }
        }, $scope.handleGeoError, $scope.geoOptions );
      }
    };

    $scope.watchPosition = function( callback ) {
      if ( navigator.geolocation ) {
        navigator.geolocation.watchPosition(function( position ) {
          if ( typeof callback === 'function' ) {
            callback( position.coords );
          }
        }, $scope.handleGeoError, $scope.geoOptions );
      }
    };

    $scope.getNearby = function() {
      if(marker) { // to remove markers when going back to select another tour...
        map.removeLayer(marker);
      }
      $scope.changeState = true; // to get buttons to reappear
      $scope.getPosition(function( position ) {
        $http.get('api/tours/nearby/' + position.latitude + '/' + position.longitude )
          .success(function( data ) {
            $scope.tours = data;
            console.log("data");
            console.log(data);
            console.log("data.route");
            console.log(data[0].route);
            // $scope.tour = data[0].route
            $scope.launchMap();
            // $scope.plotTour();
          })
          .error(function( err ) {
            $scope.errors.push( err );
          });
      });
    };

    $scope.getAll = function() {
      Tour.getAll(function(err, data) {
        if (err) return $scope.errors.push({msg: 'could not get tours'});
        $scope.tours = data;
      });
    };

    $scope.updatePosition = function( position ) {
      $scope.currentPosition = {
        latitude: position.latitude,
        longitude: position.longitude
      }
      console.log( position );
    };


    $scope.launchMap = function() {
      $scope.attachImagesToMap();
      $scope.watchPosition(function( position ) {
        $scope.map.setView([ position.latitude, position.longitude ], 18 ); // Set view centered on current position
        $scope.updatePosition( position );
      });
    };

    $scope.plotTour = function() {
      $scope.tour.forEach(function( landmark ) {
        // var lat = landmark.position.coordinates[1];
        // var lng = landmark.position.coordinates[0];
        $scope.addLandmark( $scope.map, landmark.position.coordinates )
        console.log( landmark.position.coordinates );
      });
    };

    // $scope.launchMap();
    // $scope.plotTour();

    $scope.clearErrors = function() {
      $scope.errors = [];
      $scope.getAll();
    };

    $scope.changeState = function(state) {
      $scope.appState = state;
      if (state === 'list') {
        $scope.currentWaypoint = 0; //quick solution, eventually should only happen when you finish a tour.
      }
      //States:
      //start
      //list
      //navigation
      //info
    };

    $scope.startTour = function(tour) {
      // console.log("this is tour passed in");
      // console.log(tour.tour);
      $scope.changeState = false; // to get buttons to leave, most likely there's a better wayfmarker
      $scope.tour = tour.tour.route;
      $scope.watchPosition(function( position) {
        $scope.userPosition = position;
        $scope.addMarker($scope.map, position);
      });
      $scope.plotTour();
      // $scope.addMarker($scope.map,  );

      if ($scope.currentTour !== tour) {
        $scope.currentTour = tour;
        $scope.currentWaypoint = 0;
      }
    };

    $scope.nextWaypoint = function() {
      if ($scope.currentWaypoint < $scope.currentTour.waypoints.length - 1) {
        $scope.currentWaypoint++;
      }
    };

    $scope.prevWaypoint = function() {
      if ($scope.currentWaypoint > 0) {
        $scope.currentWaypoint--;
      }
    };
  }]); //end app.controller
}; //end module.exports
