'use strict';

module.exports = function(app) {
  app.directive('navDirective', function() {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: '/templates/directives/nav.html',
      scope: {
        tour: '=',
        currentWaypoint: '=',
        prevWaypoint: '&',
        nextWaypoint: '&',
        changeState: '&'
      },
      transclude: true //not sure if we'll need this, but if we do I'd rather it start breaking things early on
    };
  });
};
