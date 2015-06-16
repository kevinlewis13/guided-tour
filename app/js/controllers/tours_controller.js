'use strict';

var geolib = require('geolib');

module.exports = function(app) { //app === an angular module
  app.controller('takeTourController', ['$scope', '$http', 'RESTResource', function($scope, $http, restResource) {
    var Tour = restResource('tours');
    $scope.errors = [];
    $scope.tours = [{name: 'Tour 1'}, {name: 'Tour 2'}];
    var appState = 'start';

    $scope.geoOptions = {
      enableHighAccuracy: true,
      maximumAge: 8000
    }

    $scope.initializeMap = function( position, callback ) {
      var map = L.map('map', {
        center: [ position.latitude, position.longitude ],
        zoom: 18
      });
      L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data',
          maxZoom: 19
        }).addTo( map );
      if ( typeof callback === 'function' ) {
        callback( map );
      }
    };

    $scope.addMarker = function( map, position ) {
      L.marker([ position.latitude, position.longitude ], {
        title: 'Here!'
      }).addTo( map );
    }

    // $scope.isNear = function( position,/ )

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
        }, $scope.handleGeoError, $scope.geoOptions )
      }
    };

    $scope.watchPosition = function( callback ) {
      if ( navigator.geolocation ) {
        navigator.geolocation.watchPosition(function( position ) {
          if ( typeof callback === 'function' ) {
            callback( position.coords );
          }
        }, $scope.handleGeoError, $scope.geoOptions )
      }
    };

    $scope.getNearby = function() {
      $scope.getPosition(function( position ) {
        $http.get('api/tours/nearby/' + position.latitude + '/' + position.longitude )
          .success(function( data ) {
            $scope.tours = data;
          })
          .error(function( err ) {
            $scope.errors.push( err );
          })
      });
    };

    $scope.getAll = function() {
      Tour.getAll(function(err, data) {
        if (err) return $scope.errors.push({msg: 'could not get tours'});
        $scope.tours = data;
      });
    };

    $scope.launchMap = function() {
      $scope.getPosition(function( position ) {
        $scope.initializeMap( position, function( map ) {
          $scope.watchPosition(function( position ) {
            $scope.addMarker( map, position );
          });
        });
      });
    };

    $scope.launchMap();

    $scope.clearErrors = function() {
      $scope.errors = [];
      $scope.getAll();
    };

    $scope.changeState = function(state) {
      appState = state;
      //States:
      //start
      //list
      //navigation
      //site info
    };
  }]); //end app.controller
}; //end module.exports
