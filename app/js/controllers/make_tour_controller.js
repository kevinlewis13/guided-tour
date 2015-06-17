'use strict';

module.exports = function( app ) {
  app.controller('makeTourController', [ '$scope', 'leafletData', function( $scope, leafletData ) {
    $scope.landmarks = [];
    $scope.currentPositionMarker;

    // Leaflet defaults
    angular.extend($scope, {
      defaults: {
        tileLayer: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        maxZoom: 18
      }
    })

    $scope.centerMap = function() {
      leafletData.getMap('map').then(function( map ) {
        navigator.geolocation.watchPosition(function( position ) {
          map.setView([ position.coords.latitude, position.coords.longitude ], 18 );
          $scope.currentPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          if ( $scope.currentPositionMarker ) {
            $scope.currentPositionMarker = null;
            map.removeLayer( $scope.currentPositionMarker );
          }
          $scope.currentPositionMarker = L.marker([ position.coords.latitude, position.coords.longitude ]);
          map.addLayer( $scope.currentPositionMarker );
        });
      });
    }

    $scope.addPin = function( position ) {
      var newLandmark = {
        position: {
          type: "Point",
          coordinates: [ position.longitude, position.latitude ]
        },
        artifact: {
          description: $scope.newLandmark.description
        }
      };
      $scope.landmarks.push( newLandmark );
    }
  }]);
}
