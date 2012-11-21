'use strict';

(function () {
  angular.module('mpga.income-expenses')
    .filter('matchDescriptionAndSum', function () {
      return function (monthData, description) {
        // the filter before this one is passing an array of months, like the income/expense data
        if (_.size(monthData) == 0)
          return 0;
        else
          return _.chain(monthData).
            map(function (monthDatum) {
              return _.chain(monthDatum.transactionSummaries).
                filter(function (transactionSummary) {
                  return transactionSummary.description === description;
                }).
                pluck('amount').
                value();
            }).
            flatten().
            reduce(function (a, b) {
              return a + b;
            }, 0).
            value();
      };
    })
})();