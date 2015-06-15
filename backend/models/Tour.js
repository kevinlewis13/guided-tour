'use strict';

var mongoose = require('mongoose');

var tourSchema = new mongoose.Schema({
  name: String,
  creator: String,
  description: String,
  category: String,
  rating: String,
  length: {
    distance: Number,
    units: String
  },
  startPosition: {
    latitude: Number,
    longitude: Number
  },
  route: [
    {
      position: {
        latitude; Number,
        longitude: Number
      },
      artifact: {
        description: String,
        url: String
      }
    }
  ]
});

module.exports = mongoose.model('Tour', tourSchema);

/* startPosition would be the same as route[0], I suppose.

 I think this might need to be broken out into several
 collections as we pursue tour creation by users */
