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
<<<<<<< HEAD
    {
=======
          {
>>>>>>> 7493174c4fc1c3f150faff1438e6f7aee43ce208
      position: {
        type: { type: String },
        coordinates: [Number]
      },
      artifact: {
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
