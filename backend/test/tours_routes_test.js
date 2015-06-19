'use strict';

process.env.TOURSTEST_URI = 'mongodb://localhost/tours_test';
require('../../server.js');

var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var mongoose = require('mongoose');

chai.use(chaiHttp);
describe('Single-Resource REST API', function() {

  before(function(done) {
    done();
  });
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  it('should be able to create a tour', function(done) {
    var testTour = {
      name: 'Test Tour',
      creator: 'Some User',
      description: 'A pretty boring tour, really',
      route: [{
        position: {
          type: "Point",
          coordinates: [-122.335894, 47.623312]
        },
        artifact: {
          description: 'Test description of some landmark.'
        }
      }]
    };
    chai.request('localhost:3000')
      .post('/api/tours/create_tour')
      .send(testTour)
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body.success).to.eql(true);
        done();
      });
  });

  it('should be able to get all tours', function(done) {
    chai.request('localhost:3000')
    .get('/api/tours')
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.eql(200);
      expect(Array.isArray(res.body)).to.eql(true);
      expect(res.body.length).to.not.eql(0);
      //expect(res.body[0].name).to.eql('Test Tour');
      done();
    });
  });

  /*
  it('should be able to find nearby tours', function(done) {
    chai.request('localhost:3000')
    .get('/api/tours/nearby/-122.335894/47.623312')
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.eql(200);
      expect(Array.isArray(res.body)).to.eql(true);
      expect(res.body.length).to.eql(1);
      done();
    });
  });
  */

  it('should reject distant tours', function(done) {
    //(we shouldn't get any results, there being only one distant tour in the database)
    chai.request('localhost:3000')
    .get('/api/tours/nearby/60.23456/20.78910')
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.eql(200);
      expect(Array.isArray(res.body)).to.eql(true);
      expect(res.body.length).to.eql(0);
      done();
    });
  });
});
