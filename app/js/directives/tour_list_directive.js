'use strict';

module.exports = function(app) {
  app.directive('tourListDirective', function() {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: '/templates/directives/tour_list.html',
      scope: {
        //getNearby: '&',
        tours: '&'
      },
      transclude: true //not sure if we'll need this, but if we do I'd rather it start breaking things early on
    };
  });
};
