'use strict';

(function () {
  angular.module('mpga.giving-range')
    .filter('rangeHighPass',function () {
      // Careful, this function is a high PASS.
      // All partners with HIGHER than range.low * 12 yearly giving are allowed through
      return function (partners, range) {
        if (_.isArray(partners))
          return _.filter(partners, function (partner) {
            return partner['twelveMonthTotalAmount'] >= range.low * 12;
          });
        else
          return [];
      };
    });
})();