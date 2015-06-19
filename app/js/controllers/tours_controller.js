'use strict';

var geolib = require('geolib');

module.exports = function(app) { //app === an angular module
  app.controller('takeTourController', ['$scope', 'RESTResource', '$location', function($scope, restResource, $location) {
    var Tour = restResource('tours');
    $scope.errors          = [];
    $scope.route           = [];
    $scope.tours           = [];
    $scope.currentTour     = null;
    $scope.currentWaypoint = 0;
    $scope.currentPositionMarker;
    $scope.onTour = false;
    $scope.Tours = true;
    $scope.NearbyTours = true;
    $scope.map;
    //$scope.tourListState = 'modal-list-show';
    $scope.artifactState;

    $scope.geoOptions = {
      enableHighAccuracy: true,
      maximumAge: 0
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
      $scope.artifactState = 'modal-list-hide';
      $scope.map = L.map('map', {
        dragging: true,
        zoomControl: false
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
      $scope.getPosition(function( position ) {
        $scope.map.setView([ position.latitude, position.longitude ], 18 ); // Set view centered on current position for initial background
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
      // setTimeout(function() {
      //   $scope.getPosition(function( position ) {
      //     callback(position);
      //   })
      // }, 3000)
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
        //this should be rolled into the first get position call
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
      //$scope.tourListState = 'modal-list-hide';

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
      var userIcon = L.divIcon({
        className: 'user-position-icon'
      });
      $scope.watchPosition(function( position ) {
        //something will need to pop here.
        $scope.tourCoordinates.push([position.latitude, position.longitude]);
        $scope.map.fitBounds($scope.tourCoordinates, 18 );

        console.log($scope.tourCoordinates);
        if ( !$scope.currentPositionMarker ) {
          $scope.currentPositionMarker = L.marker([ position.latitude, position.longitude ], {icon: userIcon});
          $scope.currentPositionMarker.addTo( $scope.map );
        } else {
          console.log($scope.currentPositionMarker);
          $scope.currentPositionMarker.setLatLng([ position.latitude, position.longitude ]);
        }
        callback(position);
      });
    };
    $scope.tourCoordinates = [];
    $scope.plotTour = function() {

      $scope.route.forEach(function( landmark ) {
        var rotateCoordinates = [];
        $scope.addLandmark( $scope.map, landmark.position.coordinates );
        rotateCoordinates.push(landmark.position.coordinates[1]);
        rotateCoordinates.push(landmark.position.coordinates[0]);
        console.log('rotate coords');
        console.log(rotateCoordinates);
        $scope.tourCoordinates.push(rotateCoordinates);
      });
      console.log('tourCoords');
      console.log($scope.tourCoordinates);
      $scope.map.fitBounds($scope.tourCoordinates);
    };

    $scope.addLandmark = function( map, position, options ) {
      L.circle([ position[1], position[0] ], 10, {
        color: 'red',
        fill: '#fca'
      }).addTo( map );
    };

    $scope.compareDistance = function( tour, position ) {
      var latLandMark;
      var lngLandmark;
      //$scope.currentWaypoint = $scope.currentWaypoint++ || 0;
      console.log( $scope.currentWaypoint );
      if ($scope.currentWaypoint < $scope.route.length) {
        lngLandmark = $scope.route[$scope.currentWaypoint].position.coordinates[0];
        latLandMark = $scope.route[$scope.currentWaypoint].position.coordinates[1];

        var distance = geolib.getDistance(
          {latitude: latLandMark, longitude: lngLandmark },
          {latitude: position.latitude, longitude: position.longitude}
        );

        if (distance <= 20000) {
          console.log( distance );
          //$scope.updateClass();
          $scope.artifactState = 'modal-list-show';
          $scope.$digest();
          //$scope.artifactState = true;
          //alert( $scope.route[$scope.currentWaypoint].artifact.description )
          //$scope.currentWaypoint++;
        } else {
          // $scope.artifactState = 'modal-list-hide';
        }
      } else if ($scope.currentWaypoint === $scope.currentTour.route.length) {
        var node = document.createElement('p');
        var text = document.createTextNode("Thanks for taking this tour");
        node.appendChild(text);
        document.getElementById('waypoint-modal').appendChild(node);
        document.getElementById('endbutton').innerHTML = "Take another tour!";
        $scope.artifactState = 'modal-list-show';
        $scope.$digest();
        // alert("tour all done!")
        //$scope.currentWaypoint = $scope.route.length;
        //document.getElement
        //document.appendChild
      }
    };

    $scope.nextWaypoint = function() {
        setTimeout(function() {
          $scope.currentWaypoint++;
        }, 600);
      if ($scope.currentWaypoint < $scope.currentTour.route.length) {
        $scope.artifactState = 'modal-list-hide';
      } else if ($scope.currentTour.route.length === $scope.currentWaypoint) {
        $scope.artifactState = 'modal-list-show';
        // $scope.$digest();
        $location.path('/');
      }
    };

  }]); //end app.controller
}; //end module.exports
