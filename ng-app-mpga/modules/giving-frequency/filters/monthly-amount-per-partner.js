'use strict';

(function () {
  angular.module('mpga.giving-frequency')
    .filter('monthlyAmountPerPartner', ['$filter', function (filter) {
      return function (partners) {
        return filter('monthlyAmount')(partners) / _.size(partners);
      };
    }]);
})();