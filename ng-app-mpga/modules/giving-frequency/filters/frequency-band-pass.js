'use strict';

(function () {
  angular.module('mpga.giving-frequency')
    .filter('frequencyBandPass',function () {
      return function (partners, range) {
        if (_.isArray(partners))
          return _.filter(partners, function (partner) {
            return partner['twelveMonthTotalCount'] <= range.high
              && partner['twelveMonthTotalCount'] >= range.low;
          });
        else
          return [];
      };
    });
})();