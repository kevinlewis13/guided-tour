'use strict';

module.exports = function( app ) {
  app.controller('makeTourController', [ '$scope', '$http', '$location', function( $scope, $http, $location ) {
    $scope.errors = [];
    $scope.landmarks = [];
    $scope.currentPositionMarker = null;
    $scope.map = null;

    $scope.landmarkFormState = 'landmark-form-hidden';
    $scope.formState = 'form-hidden';

    $scope.toggleNav = function() {
      if ($scope.formState === "form-hidden") {
        $scope.formState = "form-showing";
      } else {
        $scope.formState = "form-hidden";
      }
    };

    $scope.loadMap = function() {
      $scope.map = L.map('map', {
        dragging: true,
        zoomControl: false
      });
    };

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
        };
        if ( !$scope.currentPositionMarker ) {
          $scope.currentPositionMarker = L.marker([ position.latitude, position.longitude ], {icon: userIcon});
          $scope.currentPositionMarker.addTo( $scope.map );
          return;
        } else {
          $scope.currentPositionMarker.setLatLng([ position.latitude, position.longitude ]);
        }
      });
    };

    $scope.addPin = function( position ) {
      console.log( position );
      var newLandmark = {
        position: {
          type: "Point",
          coordinates: [ position.longitude, position.latitude ]
        },
        artifact: {
          name: $scope.newLandmark.name,
          description: $scope.newLandmark.description
        }
      };
      $scope.newLandmark.name = '';
      $scope.newLandmark.description = '';
      $scope.landmarks.push( newLandmark );
      $scope.landmarkFormState = 'landmark-form-hidden';
    };

    $scope.postTour = function( tour ) {
      var newTour = {
        name: tour.name,
        creator: tour.creator,
        description: tour.description,
        route: $scope.landmarks
      };
      $http.post('/api/tours/create_tour', newTour )
        .success(function( data ) {
          console.log( data );
        })
        .error(function( err ) {
          $scope.errors.push({ message: 'Could not create tour', error: err });
        });
        $scope.toggleNav();
        $scope.landmarkListState = 'create-finale';
    };

    $scope.goHome = function() {
      $location.path('/');
    };

    $scope.init = function() {
      $scope.loadMap();
      $scope.attachImagesToMap();
      $scope.trackUser();
    };
  }]);
};
