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
    var tourController = $cc('takeTourController', {$scope: $scope});
    expect(typeof tourController).toBe('object');
    expect(Array.isArray($scope.tours));
    expect(typeof $scope.loadMap).toBe('function');
    expect(typeof $scope.map).toBe('object');
  });


  //a separate describe block, to have a different beforeEach and guaranteeing that these are nested
  describe('REST functionality', function() {
    beforeEach(angular.mock.inject(function(_$httpBackend_) { //the underscores are for clarity, we could just say $httpBackend
      $httpBackend = _$httpBackend_;
      this.tourController = $cc('takeTourController', {$scope: $scope}); //gives us access to $scope.getAll
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    var testTour = {
      _id: '1',
      name: 'Test Tour',
      creator: 'Some User',
      description: 'A rudimentary tour for testing',
      category: 'FUN',
      rating: '5.0',
      length: {
        distance: 2,
        units: 'km'
      },
      route: [
        {
          position: {
            type: { type: 'Point' },
            coordinates: [567.8, 123.4]
          },
          artifact: {
            description: 'Its eyes follow you.',
            url: 'http://i.imgur.com/3wNLbwW.jpg'
          }
        }
      ]
    };
    var testTour2 = JSON.parse(JSON.stringify(testTour));
    testTour2.name = 'Test Tour 2, with a DIFFERENT NAME';

    it('should be able to get nearby tours', function() {
      $scope.testingPosition = {latitude: 123.4, longitude: 567.8};
      $httpBackend.expectGET('api/tours/nearby/123.4/567.8').respond(200, [testTour]);

      $scope.getNearby();
      $scope.tours = null;
      $httpBackend.flush();
      expect(typeof $scope.tours).toBe('object');
    });

    it('should be able to get all tours', function() {
      $scope.testingPosition = {latitude: 123.4, longitude: 567.8};
      $httpBackend.expectGET('/api/tours').respond(200, [testTour, testTour2]);

      $scope.getAll();
      $scope.tours = null;
      $httpBackend.flush();
      expect(typeof $scope.tours).toBe('object');
    });

    //We can do error testing here much more easily than in our integration tests
    it('should correctly handle errors', function() {
      $scope.testingPosition = {latitude: 123.4, longitude: 567.8};
      $httpBackend.expectGET('api/tours/nearby/123.4/567.8')
        .respond(500, {msg: 'internal server error'});
      $scope.getNearby();

      $httpBackend.expectGET('/api/tours')
        .respond(500, {msg: 'very nondescript error message'});
      $scope.getAll();

      $httpBackend.flush();

      expect($scope.errors.length).toBe(2);
      expect($scope.errors[0].msg).toBe('could not get nearby tours');
      expect($scope.errors[1].msg).toBe('could not get all tours');

      $scope.clearErrors();
      expect($scope.errors.length).toBe(0);
    });

    it('should correctly update the user\'s position', function() {
      var testPos = {
        latitude: 3.14159,
        longitude: 2.65358
      };
      $scope.testPos = testPos;
      testPos.latitude += 1.2345;
      testPos.longitude -=1.2345;
      $scope.updatePosition(testPos);
      expect($scope.currentPosition.latitude).toBe(testPos.latitude);
      expect($scope.currentPosition.longitude).toBe(testPos.longitude);
    });

    it('should correctly start the user on a tour', function() {

    });
  });
});
