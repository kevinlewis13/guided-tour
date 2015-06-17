'use strict';

module.exports = function( app ) {
  app.controller('helloController', [ '$scope', '$location', function( $scope, $location ) {
    $scope.gotoNearby = function() {
      $location.path('/nearby');
    }
    $scope.gotoMakeTour = function() {
      $location.path('/make');
    }
  }])
}
