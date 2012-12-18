'use strict';

(function () {
  angular.module('mpga.income-expenses')
    .filter('transactionSummaries', function() {
      return function(months) {
        return _.flatten(_.pluck(months, 'transactionSummaries'));
      }
    })
})();