'use strict';

/* Filters */
(function () {
  angular.module('mpgaFilters', []).
    filter('divideByTwelve',function () {
      return function (input) {
        if (_.isNumber(input))
          return input / 12;
        else
          return input;
      };
    }).
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
    filter('monthlyAmountPerPartner', ['$filter', function (filter) {
      return function (partners) {
        return filter('monthlyAmount')(partners) / _.size(partners);
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
    filter('rangeHighPass',function () {
      // Careful, this function is a high PASS.
      // All partners with HIGHER than range.low * 12 yearly giving are allowed through
      return function (partners, range) {
        if (_.isArray(partners))
          return _.filter(partners, function (partner) {
            return partner['twelveMonthTotalAmount'] > range.low * 12;
          });
        else
          return [];
      };
    }).
    filter('rangeBandPass',function () {
      return function (partners, range) {
        if (_.isArray(partners))
          return _.filter(partners, function (partner) {
            return partner['twelveMonthTotalAmount'] < range.high * 12
              && partner['twelveMonthTotalAmount'] > range.low * 12;
          });
        else
          return [];
      };
    }).
    filter('frequencyBandPass',function () {
      return function (partners, range) {
        if (_.isArray(partners))
          return _.filter(partners, function (partner) {
            return partner.twelveMonthTotalCount <= range.high
              && partner.twelveMonthTotalCount >= range.low;
          });
        else
          return [];
      };
    }).
    filter('matchDescriptionAndSum', function () {
      return function (monthData, description) {
        // the filter before this one is passing an array of months, like the income/expense data
        if (_.size(monthData) == 0)
          return 0;
        else
          return _.chain(monthData).
            map(function (monthDatum) {
              return _.chain(monthDatum.transactionSummaries).
                filter(function (transactionSummary) {
                  return transactionSummary.Description === description;
                }).
                pluck('total').
                value();
            }).
            flatten().
            reduce(function (a, b) {
              return a + b;
            }, 0).
            value();
      };
    }).
    filter('moment', function () {
      return function (date, format) {
        return moment(date).format(format);
      };
    });
})();


