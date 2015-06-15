"use strict";

var bodyparser = require("body-parser");
var Tour       = require("../models/Tour.js");

module.exports = function(router) {
  router.get("/tours/:long/:lat", function(req, res) {
    var longitude = req.params.long;
    var latitude  = req.params.lat

Tour.find({all tours within 400 meters})



// 402.336 meters is 1/4 mile.


    // Get the distance between two locations in meters.
    geolib.getDistance(object, {
      latitude: 51.525, // get from DB
      longitude: 7.4575 // gte from DB
    })




  })

router.post("/tours/create_tour", function(req, res) {
  var tourData = JSON.parse(JSON.stringify(req.body))
  var newTour = new Tour(tourData);

  newTour.save(function(err, tour) {
     if ( err ) {
          console.log( 'Error creating tour. Error: ', err );
          return res.status(500).json({ "success": false });
        };
        res.json({ "success": true });
  })
})
}


