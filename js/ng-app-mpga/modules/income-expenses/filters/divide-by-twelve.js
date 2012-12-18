'use strict';

(function () {
  angular.module('mpga.income-expenses')
    .filter('divideByTwelve',function () {
      return function (input) {
        if (_.isNumber(input))
          return input / 12;
        else
          return input;
      };
    })
})();