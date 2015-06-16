'use strict';

require('../../js/client.js');
require('angular-mocks');

describe('tours controller', function() {
  var $cc;
  var $httpBackend;
  var $scope;

  beforeEach(angular.mock.module('toursApp'));

  beforeEach(angular.mock.inject(function($rootscope, $controller) {
    $scope = $rootscope.$new();
    $cc = $controller;
  }));

  it('should be able to create a new controller', function() {

  });
});
