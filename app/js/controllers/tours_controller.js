'use strict';

module.exports = function(app) { //app === an angular module
  app.controller('rabbitsController', ['$scope', 'RESTResource', function($scope, restResource) {
    var Tour = restResource('tours');
    $scope.errors = []; //so you can just throw errors in here as they happen
    $scope.tours = []; //(we need these to be $scope. so that we can access them in the view)
    $scope.appMode = 'editing';

    $scope.getAll = function() {
      Tour.getAll(function(err, data) {
        if (err) return $scope.errors.push({msg: 'could not get rabbits'});
        $scope.tours = data;
      });
    };

    $scope.clearErrors = function() {
      $scope.errors = [];
      $scope.getAll();
    };
  }]); //end app.controller
}; //end module.exports
