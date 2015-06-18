'use strict';

var geolib = require('geolib');

module.exports = function(app) { //app === an angular module
  app.controller('takeTourController', ['$scope', 'RESTResource', '$location', function($scope, restResource, $location) {
    var Tour = restResource('tours');
    $scope.errors          = [];
    $scope.route            = [];
    $scope.tours           = [];
    $scope.currentTour     = null;
    $scope.currentWaypoint = 0;
    $scope.currentPositionMarker;
    $scope.onTour;
    $scope.map;

    $scope.geoOptions = {
      enableHighAccuracy: true,
      maximumAge: 8000
    };

    $scope.clearErrors = function() {
      $scope.errors = [];
      $scope.getAll();
    };


    $scope.goHome = function() {
      $location.path('/');
    };

    $scope.getAll = function() {
      Tour.getAll(function(err, data) {
        if (err) return $scope.errors.push({msg: 'could not get tours'});
        $scope.tours = data;
      });
    };

    $scope.loadMap = function() {
      $scope.map = L.map('map');
      $scope.attachImagesToMap();
      $scope.findUser();
      $scope.getNearby();
    };

    $scope.attachImagesToMap = function() {
      L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo( $scope.map );
    };

    $scope.findUser = function() {
      $scope.watchPosition(function( position ) {
        $scope.map.setView([ position.latitude, position.longitude ], 18 ); // Set view centered on current position
      });
    };

    $scope.getNearby = function() {
      $scope.getPosition(function( position ) {
        //console.log('derp position: ' + position);
        Tour.getNearby(position, function(err, data) {
          if (err) return $scope.errors.push({msg: 'could not get nearby tours'});
          $scope.tours = data;
        });
      });
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

    $scope.handleGeoError = function( err ) {
      $scope.errors.push({ message: 'Could not get location', error: err });
      console.log( err );
    };

    $scope.startTour = function(tour) {
      $scope.onTour = true; // to get buttons to leave, most likely there's a better way
      $scope.route = tour.tour.route;
      $scope.trackUser(function(position) {
        $scope.compareDistance(tour, position)
      });
      $scope.plotTour();

      if ($scope.currentTour !== tour) {
        $scope.currentTour = tour;
        $scope.currentWaypoint = 0;
      }
    };

    $scope.trackUser = function(callback) {
      $scope.watchPosition(function( position ) {
        $scope.map.setView([ position.latitude, position.longitude ], 18 );
        if ( !$scope.currentPositionMarker ) {
          $scope.currentPositionMarker = L.marker([ position.latitude, position.longitude ]);
          $scope.currentPositionMarker.addTo( $scope.map );
          return;
        } else {
          $scope.currentPositionMarker.setLatLng([ position.latitude, position.longitude ]);
        }
        callback(position);
      });
    };

    $scope.plotTour = function() {
      $scope.route.forEach(function( landmark ) {

        $scope.addLandmark( $scope.map, landmark.position.coordinates )
      });
    };

    $scope.addLandmark = function( map, position, options ) {
      L.circle([ position[1], position[0] ], 10, {
        color: 'red',
        fill: '#fca'
      }).addTo( map );
    };

    $scope.watchPosition = function( callback ) {
      if ( navigator.geolocation ) {
        if ( window.watcher ) {
          navigator.geolocation.clearWatch( window.watcher );
        }
        window.watcher = navigator.geolocation.watchPosition(function( position ) {
          if ( typeof callback === 'function' ) {
            callback( position.coords );
          }
        }, $scope.handleGeoError, $scope.geoOptions );
      }
    };

    // var latLandMark;
    // var lngLandmark;
    // var count = 0;
    $scope.compareDistance = function(tour, position) {
      var latLandMark;
      var lngLandmark;
      var count = 0;
      lngLandmark = $scope.route[count].position.coordinates[0];
      latLandMark = $scope.route[count].position.coordinates[1];

      var distance = geolib.getDistance(
        {latitude: latLandMark, longitude: lngLandmark },
        {latitude: position.latitude, longitude: position.longitude}
      );

      if (distance <= 5) {
        alert($scope.route[count].artifact.description);
        alert($scope.currentWaypoint);
        count++;
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
