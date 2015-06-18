'use strict';

require('../../js/client.js');
require('angular-mocks');

describe('helloController', function() {
  var $cc;
  var $scope;

  beforeEach(angular.mock.module('toursApp'));

  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    $cc = $controller;
  }));

  it('should be able to create a new controller', function() {
    var helloController = $cc('helloController', {$scope: $scope});
    expect(typeof helloController).toBe('object');
    expect(typeof $scope.gotoNearby).toBe('function');
  });
});
