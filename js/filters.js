'use strict';

/* Filters */
(function () {
  angular.module('mpgaFilters', []).
    filter('amount',function () {
      return function (partners) {
        return _.chain(partners).
          pluck('twelveMonthTotalAmount').
          reduce(function (a, b) {
            if(_.isUndefined(b))
              return parseFloat(a);
            else
              return parseFloat(a) + parseFloat(b);
          }, 0).
          value();
      };
    }).
    filter('monthlyAmount', ['$filter', function (filter) {
      return function (partners) {
        return filter('amount')(partners) / 12;
      };
    }]).

    filter('size',function () {
      return function (arr) {
        return _.size(arr);
      };
    }).
    filter('amountPercentage', ['$filter', function (filter) {
      return function (partners, total) {
        return filter('amount')(partners) / total * 100;
      };
    }]).
    filter('countPercentage',function () {
      return function (partners, total) {
        return _.size(partners) / total * 100;
      };
    }).
    filter('moment', function () {
      return function (date, format) {
        return moment(date).format(format);
      };
    });
})();


