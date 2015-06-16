"use strict";

var bodyparser = require("body-parser");
var Tour       = require("../models/Tour.js");

module.exports = function(router) {
  router.use( bodyparser.json() );

  router.get("/tours/:long/:lat", function(req, res) {
    var longitude = req.params.long;
    var latitude  = req.params.lat;

    Tour.find({"route.0.position": {
      $near: { type: "Point", coordinates: [ longitude, latitude]}, $maxDistance: 400 }}, function(err, tours) {
        if (err) {
          console.log(err);
          res.json({msg: "Error getting tours"});
        }
       res.json(tours);
   });
  });

  router.post("/tours/create_tour", function(req, res) {
    var newTour = new Tour(req.body);

    newTour.save(function(err, tour) {
       if ( err ) {
            console.log( 'Error creating tour. Error: ', err );
            return res.status(500).json({ "success": false });
          };
          res.json({ "success": true });
    });
  });
};


