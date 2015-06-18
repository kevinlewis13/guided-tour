'use strict';

var geolib = require('geolib');

module.exports = function(app) { //app === an angular module
  app.controller('takeTourController', ['$scope', 'RESTResource', '$location', function($scope, restResource, $location) {
    var Tour = restResource('tours');
    $scope.errors          = [];
    $scope.route           = [];
    $scope.tours           = [];
    $scope.currentTour     = null;
    $scope.currentWaypoint;
    $scope.currentPositionMarker;
    $scope.onTour = false;
    $scope.Tours = true;
    $scope.NearbyTours = true;
    $scope.map;
    $scope.tourListState = 'modal-list-show';
    $scope.artifactState = 'modal-list-hide';

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
        if (err) return $scope.errors.push({msg: 'could not get all tours'});
        $scope.tours = data;
      });
    };

    $scope.gotoMakeTour = function() {
      $location.path("/create_tour");
    };

    $scope.loadMap = function() {
      $scope.map = L.map('map', {
        dragging: true
      });
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

    $scope.getPosition = function( callback ) {
      if ( navigator.geolocation ) {
        navigator.geolocation.getCurrentPosition(function( position ) {
          if ( typeof callback === 'function' ) {
            callback( position.coords );
          }
        }, $scope.handleGeoError, $scope.geoOptions );
      } else if ($scope.testingPosition) { //this is for tests
        callback($scope.testingPosition); // this is for tests
      }
    };

    $scope.watchPosition = function( callback ) {
      if ( navigator.geolocation ) {
        if ( window.watcher ) {
          console.log( 'watcher id: ' + window.watcher );
          // navigator.geolocation.clearWatch( window.watcher );
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
        //console.log('derp position: ' + position);
        Tour.getNearby(position, function(err, data) {
          if (err) return $scope.errors.push({msg: 'could not get nearby tours'});
          if (data.length < 1) {
            // $scope.Tours = false;
            // $scope.NearbyTours = false;
            $location.path('/Could_Not_Find_Tours');

          } else {
          $scope.tours = data;
          }
        });
      });
    };

    $scope.handleGeoError = function( err ) {
      $scope.errors.push({ message: 'Could not get location', error: err });
      console.log( err );
    };

    $scope.startTour = function(tour) {
      $scope.tourListState = 'modal-list-hide';
      $scope.onTour = true; // to get buttons to leave, most likely there's a better way
      $scope.route = tour.tour.route;
      $scope.trackUser(function(position) {
        console.log("location found");
      });
      $scope.watchPosition(function(position) {
        $scope.compareDistance(tour, position);
      });
      $scope.plotTour();

      if ($scope.currentTour !== tour.tour) {
        $scope.currentTour = tour.tour;
        // $scope.currentWaypoint = 0;
      }
    };

    $scope.trackUser = function(callback) {
      $scope.watchPosition(function( position ) {
        $scope.map.setView([ position.latitude, position.longitude ], 18 );
        if ( !$scope.currentPositionMarker ) {
          $scope.currentPositionMarker = L.marker([ position.latitude, position.longitude ]);
          $scope.currentPositionMarker.addTo( $scope.map );
        } else {
          console.log($scope.currentPositionMarker);
          $scope.currentPositionMarker.setLatLng([ position.latitude, position.longitude ]);
        }
        callback(position);
      });
    };

    $scope.plotTour = function() {
      $scope.route.forEach(function( landmark ) {
        $scope.addLandmark( $scope.map, landmark.position.coordinates );
      });
    };

    $scope.addLandmark = function( map, position, options ) {
      L.circle([ position[1], position[0] ], 10, {
        color: 'red',
        fill: '#fca'
      }).addTo( map );
    };
    // var latLandMark;
    // var lngLandmark;
    // var count = 0;
    $scope.compareDistance = function( position ) {
      var latLandMark;
      var lngLandmark;
      // var count = 0;
      $scope.currentWaypoint = $scope.currentWaypoint++ || 0;
      if ($scope.currentWaypoint < $scope.route.length) {
        lngLandmark = $scope.route[$scope.currentWaypoint].position.coordinates[0];
        latLandMark = $scope.route[$scope.currentWaypoint].position.coordinates[1];

        var distance = geolib.getDistance(
          {latitude: latLandMark, longitude: lngLandmark },
          {latitude: position.latitude, longitude: position.longitude}
        );

        if (distance <= 100) {
          console.log( distance );
          $scope.artifactState = 'modal-list-show';
          // alert($scope.route[count].artifact.description);
          console.log( 'currentWaypoint: ' + $scope.currentWaypoint );
          return $scope.currentWaypoint++;
          // count++;
        } else {
          $scope.artifactState = 'modal-list-hide';
        }
      } else {
        // alert("tour all done!")
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
