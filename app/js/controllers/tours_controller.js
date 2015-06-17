'use strict';

var geolib = require('geolib');

module.exports = function(app) { //app === an angular module
  app.controller('takeTourController', ['$scope', '$http', 'RESTResource', '$location', function($scope, $http, restResource, $location) {
    var Tour = restResource('tours');
    $scope.errors          = [];
    $scope.appState        = 'start';
    $scope.currentTour     = null;
    $scope.currentWaypoint = 0;
    $scope.tour            = [];
    $scope.tours           = [];
    $scope.currentPosition = {};
    $scope.geoWatch        = null;
    $scope.onTour;

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
      $scope.attachImagesToMap();
      $scope.getNearby();
    }

    $scope.attachImagesToMap = function() {
      L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo( $scope.map );
    };

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

    $scope.getNearby = function() {
      $scope.getPosition(function( position ) {
        console.log('derp position: ' + position);
        $http.get('api/tours/nearby/' + position.latitude + '/' + position.longitude )
          .success(function( data ) {
            $scope.tours = data;
            console.log("data: " + data );
            $scope.launchMap();
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
      $scope.watchPosition(function( position ) {
        $scope.map.setView([ position.latitude, position.longitude ], 18 ); // Set view centered on current position
        $scope.updatePosition( position );
      });
    };

    $scope.plotTour = function() {
      $scope.tour.forEach(function( landmark ) {

        $scope.addLandmark( $scope.map, landmark.position.coordinates )
        console.log( landmark.position.coordinates );
      });
    };

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

    var latLandMark;
    var lngLandmark;
    var count = 0;
    $scope.compareDistance = function(tour, position) {
      lngLandmark = $scope.tour[count].position.coordinates[0];
      latLandMark = $scope.tour[count].position.coordinates[1];

      var distance = geolib.getDistance(
        {latitude: latLandMark, longitude: lngLandmark },
        {latitude: position.latitude, longitude: position.longitude}
      );

      if (distance <= 5) {
        alert($scope.tour[count].artifact.description);
        count++;
      }
    }

    $scope.startTour = function(tour) {
      $scope.onTour = true; // to get buttons to leave, most likely there's a better way
      $scope.tour = tour.tour.route;
      $scope.watchPosition(function( position) {
        $scope.compareDistance(tour, position);
        $scope.addMarker($scope.map, position);
      });
      $scope.plotTour();

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
