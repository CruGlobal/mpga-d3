'use strict';

(function () {
  angular.module('mpga.income-expenses')
    .filter('sum', function () {
      return function(array, key) {
        if(_.isUndefined(key))
          return _.reduce(array, function(memo, num) { return memo + num; }, 0);
        else
          return _.reduce(array, function(memo, num) { return memo + num[key]; }, 0);
      }
    })
})();