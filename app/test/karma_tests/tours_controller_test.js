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
  }));

  it('should be able to create a new controller', function() {
    angular.element($document[0].body).append('<section id="map"></section>');
    var tourController = $cc('takeTourController', {$scope: $scope});
    expect(typeof tourController).toBe('object');
    expect(Array.isArray($scope.tours));
    expect(typeof $scope.loadMap).toBe('function');
    expect(typeof $scope.map).toBe('object');
  });


  //a separate describe block, to have a different beforeEach and guaranteeing that these are nested
 /* describe('REST functionality', function() {
    beforeEach(angular.mock.inject(function(_$httpBackend_) { //the underscores are for clarity, we could just say $httpBackend
      $httpBackend = _$httpBackend_;
      this.tourController = $cc('takeTourController', {$scope: $scope}); //gives us access to $scope.getAll
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should make a get request on index', function() {
      $httpBackend.expectGET('/api/tours').respond(200,
        [{_id: '1', name: 'Jon Stewart', weight: 4}]);
      $scope.getAll(); //this will actually make the request that we're expecting
      $httpBackend.flush(); //will actually send all our responses that we've set up
      //(this is when our callbacks in getAll, etc... will get called)
      expect($scope.tours[0].name).toBe('Jon Stewart');
      expect($scope.tours[0]._id).toBe('1');
      expect($scope.tours[0].weight).toBe(4);
    });

    //We can do error testing here much more easily than in our integration tests
    it('should correctly handle errors', function() {
      $httpBackend.expectGET('/api/tours').respond(500,
        {msg: 'server error'});
      $scope.getAll();
      $httpBackend.flush();
      expect($scope.errors.length).toBe(1);
      expect($scope.errors[0].msg).toBe('could not get tours');
    });
  });*/
});
