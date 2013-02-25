'use strict';

(function () {
  angular.module('mpga.income-expenses')
    .filter('addSpaces', function () {
      // This filter was created to add spaces to a long string that needs to wrap
      return function (input) {
        var breakdown = function (input) {
          if (input.length < 20)
            return input;
          var halfLength = input.length / 2;
          return breakdown(input.substr(0, halfLength)) + " " +
            breakdown(input.substr(halfLength));
        };

        return breakdown(input);
      };
    })
})();