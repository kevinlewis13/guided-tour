"use strict";

var bodyparser = require("body-parser");
var Tour       = require("../models/Tour.js");

module.exports = function(router) {
  router.use( bodyparser.json() );

  router.get("/tours/nearby/:lat/:long/", function(req, res) {
    var longitude   = req.params.long;
    var latitude    = req.params.lat;
    var maxDistance = [400,800,1600,161000]; // .25 mile, .5 mile, 1 mile, 100 miles
    var tours       = [];
    var count       = 0;

    function searchDB(tours, index) {

      if (tours.length > 0) {
        return res.json(tours)
      }
        Tour.find({"route.0.position": {
      $near: { type: "Point", coordinates: [ longitude, latitude]}, $maxDistance: maxDistance[index] }}, function(err, data) {
        if (err) {
          console.log(err);
          return res.status(500).json({msg: "Error getting tours"});
        }
        if (index<3) {
          searchDB(data, count++)
      } else {
       return res.json([])
      }
   });
    }

    searchDB(tours,count);

   //  Tour.find({"route.0.position": {
   //    $near: { type: "Point", coordinates: [ longitude, latitude]}, $maxDistance: 400 }}, function(err, tours) {
   //      if (err) {
   //        console.log(err);
   //        return res.status(500).json({msg: "Error getting tours"});
   //      }
   //     return res.json(tours);
   // });
  });

  router.get("/tours", function(req, res) {
    Tour.find({}, function(err, tours) {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "Error retrieving all tours"})
      }
      return res.json(tours);
    })
  })
  router.post("/tours/create_tour", function(req, res) {
    var newTour = new Tour(req.body);

    newTour.save(function(err, tour) {
       if ( err ) {
            console.log( 'Error creating tour. Error: ', err );
            return res.status(500).json({ "success": false });
          };
          return res.json({ "success": true });
    });
  });
};
