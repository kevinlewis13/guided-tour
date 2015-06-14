'use strict';

var mongoose = require('mongoose');

var tourSchema = new mongoose.Schema({
  name: String,
  creator: String,
  description: String,
  length: {
    length: Number,
    units: String
  },
  startPosition: {
    latitude: Number,
    longitude: Number
  },
  route: [
    landmark: {
      name: String,
      artifact: String,
      position: {
        latitude; Number,
        longitude: Number
      }
    }
  ]
});

module.exports = mongoose.model('Tour', tourSchema);

/* startPosition would be the same as route[0], I suppose.

 I think this might need to be broken out into several
 collections as we pursue tour creation by users */
