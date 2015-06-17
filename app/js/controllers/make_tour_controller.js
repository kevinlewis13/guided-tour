'use strict';

module.exports = function( app ) {
  app.controller('makeTourController', [ '$scope', '$http', '$location', function( $scope, $http, $location ) {
    $scope.errors = [];
    $scope.landmarks = [];
    $scope.currentPositionMarker;
    $scope.map;

    $scope.loadMap = function() {
      $scope.map = L.map('map');
    }

    $scope.geoOptions = {
      enableHighAccuracy: true,
      maximumAge: 8000
    };

    $scope.handleGeoError = function( err ) {
      $scope.errors.push({ message: 'Could not get location', error: err });
      console.log( err );
    };

    $scope.attachImagesToMap = function() {
      L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo( $scope.map );
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

    $scope.trackUser = function() {
      var userIcon = L.divIcon({
        className: 'user-position-icon'
      });
      $scope.watchPosition(function( position ) {
        $scope.map.setView([ position.latitude, position.longitude ], 18 );
        $scope.currentPosition = {
          latitude: position.latitude,
          longitude: position.longitude
        }
        if ( !$scope.currentPositionMarker ) {
          $scope.currentPositionMarker = L.marker([ position.latitude, position.longitude ], {icon: userIcon});
          $scope.currentPositionMarker.addTo( $scope.map );
          return;
        } else {
          $scope.currentPositionMarker.setLatLng([ position.latitude, position.longitude ]);
        }
      });
    };

    $scope.addPin = function( $event, position ) {
      $event.preventDefault();
      var newLandmark = {
        position: {
          type: "Point",
          coordinates: [ position.longitude, position.latitude ]
        },
        artifact: {
          description: $scope.newLandmark.description
        }
      };
      $scope.newLandmark.description = '';
      $scope.landmarks.push( newLandmark );
    }

    $scope.postTour = function( tour ) {
      var newTour = {
        name: tour.name,
        creator: tour.creator,
        description: tour.description,
        route: $scope.landmarks
      }
      $http.post('/api/tours/create_tour', newTour )
        .success(function( data ) {
          console.log( data );
        })
        .error(function( err ) {
          $scope.errors.push({ message: 'Could not create tour', error: err })
        })
    }

    $scope.goHome = function() {
      $location.path('/');
    }

    $scope.init = function() {
      $scope.loadMap();
      $scope.attachImagesToMap();
      $scope.trackUser();
    }

  }]);
}
