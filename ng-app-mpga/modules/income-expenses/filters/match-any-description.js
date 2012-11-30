'use strict';

(function () {
  angular.module('mpga.income-expenses')
    .filter('matchAnyDescription', function () {
      return function (transactionSummaries, descriptions) {
        return _.filter(transactionSummaries, function(transactionSummary) {
          return _.contains(descriptions, transactionSummary['description'])
        });
      };
    })
})();