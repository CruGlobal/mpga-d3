'use strict';

(function () {
  angular.module('mpga.giving-range')
    .filter('rangeBandPass',function () {
      return function (partners, range) {
        if (_.isArray(partners))
          return _.filter(partners, function (partner) {
            return partner['twelveMonthTotalAmount'] < range.high * 12
              && partner['twelveMonthTotalAmount'] >= range.low * 12;
          });
        else
          return [];
      };
    });
})();