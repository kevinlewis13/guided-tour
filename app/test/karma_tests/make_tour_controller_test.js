'use strict';

require('leaflet');
require('../../js/client.js');
require('angular-mocks');

describe('takeTourController', function() {
  var $cc;
  var $httpBackend;
  var $scope;
  var $document; //to insert elements into the DOM

  beforeEach(angular.mock.module('toursApp'));

  beforeEach(angular.mock.inject(function($rootScope, $controller, _$document_) {
    $scope = $rootScope.$new();
    $cc = $controller;
    $document = _$document_;
    angular.element($document[0].body).append('<section id="map"></section>'); //DOM element required for controller
  }));

  it('should be able to create a new controller', function() {
    var makeTourController = $cc('makeTourController', {$scope: $scope});
    expect(typeof makeTourController).toBe('object');
    expect(Array.isArray($scope.landmarks));
    expect(typeof $scope.loadMap).toBe('function');
    expect(typeof $scope.map).toBe('object');
  });
});
