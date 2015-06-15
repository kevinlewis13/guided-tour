'use strict';

module.exports = function(app) {
  app.factory('deepCopy', function() {
    return function(objToCopy) {
      var obj = {};
      Object.keys(objToCopy).forEach(function(key) {
        obj[key] = objToCopy[key];
      });
      return obj;
    };
  });
};
