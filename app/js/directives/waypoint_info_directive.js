'use strict';

module.exports = function(app) {
  app.directive('waypointInfoDirective', function() {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: '/templates/directives/waypoint_info.html',
      scope: {
        tour: '=',
        currentWaypoint: '=',
        nextWaypoint: '&',
        changeState: '&'
      },
      transclude: true //not sure if we'll need this, but if we do I'd rather it start breaking things early on
    };
  });
};
