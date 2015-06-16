'use strict';

var geolib = require('geolib');

module.exports = function(app) { //app === an angular module
  app.controller('takeTourController', ['$scope', '$http', 'RESTResource', function($scope, $http, restResource) {
    var Tour = restResource('tours');
    $scope.errors = [];
    $scope.appState = 'start';
    //Placeholder tours, feel free to get rid of these
    // $scope.tours = [{name: 'Tour 1', waypoints: [{name: 'Fountain'}, {name: 'Park'}]},
    //                 {name: 'Tour 2', waypoints: [{name: 'Statue'}, {name: 'Graffiti'}]}];
    $scope.currentTour = null;
    $scope.currentWaypoint = 0;
    $scope.tour = [];
    $scope.tours = [];
    // $scope.tour = [
    //   {
    //     location: {
    //       latitude: 47.623974,
    //       longitude: -122.335937
    //     }
    //   },
    //   {
    //     location: {
    //       latitude: 47.623484,
    //       longitude: -122.336570
    //     }
    //   }
    // ]; //(we need these to be $scope. so that we can access them in the view)

    $scope.currentPosition = {};

    $scope.geoOptions = {
      enableHighAccuracy: true,
      maximumAge: 8000
    };

    $scope.map = L.map('map');

    $scope.initializeMap = function() {
      L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data',
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

    // $scope.isNear = function( position, )

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
      $scope.getPosition(function( position ) {
        $http.get('api/tours/nearby/' + position.latitude + '/' + position.longitude )
          .success(function( data ) {
            $scope.tours = data;
            console.log("data");
            console.log(data);
            console.log("data.route");
            console.log(data[0].route);
            $scope.tour = data[0].route
            $scope.launchMap();
            $scope.plotTour();
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
      $scope.initializeMap();
      $scope.watchPosition(function( position ) {
        $scope.map.setView([ position.latitude, position.longitude ], 18 );
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
      if ($scope.currentTour !== tour) {
        $scope.currentTour = tour;
        $scope.currentWaypoint = 0;
      }
      $scope.changeState('navigation');
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
