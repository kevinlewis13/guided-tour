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
  route: [
    {
      position: {
        type: { type: String },
        coordinates: [Number]
      },
      artifact: {
        name: String,
        description: String,
        url: String
      }
    }
  ]
});

// fix error: unable to find index for $geoNear query
tourSchema.index({ "route.0.position": '2dsphere' });

module.exports = mongoose.model('Tour', tourSchema);

/* startPosition would be the same as route[0], I suppose.

 I think this might need to be broken out into several
 collections as we pursue tour creation by users */
