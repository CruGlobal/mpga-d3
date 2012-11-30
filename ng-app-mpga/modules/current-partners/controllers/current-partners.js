'use strict';

(function () {
  angular.module('mpga.current-partners')
    .controller('CurrentPartnersController', ['$scope', 'Partners', function (scope, Partners) {
    /**
     * This function supports the sorting functionality in the page.
     * @param column
     */
    scope.sortOn = function (column) {
      if (scope.sortingColumn === column) {
        scope.reverse = !scope.reverse;
      } else
        scope.reverse = false;
      scope.arrowDirection = (scope.reverse ? 'ascending' : 'descending'); //CSS class names
      scope.sortingColumn = column;
      scope.active = {};
      scope.active[column] = 'sorting'; //CSS class name
    };

    Partners.fetch(scope).then(function (partners) {
      /**
       * Partners contains donors who have given in the past 12 months.
       * @type Array
       */
      scope.partners = _.reject(partners, scope.isLostPartner);

      /*
       * The rest of this callback supports the 50/50 pie chart at the bottom of the page.
       *
       * The algorithm for the 50/50 pie chart is as follows:
       *   Pluck the twelve month amounts from the current partners
       *   Sum them up and save that for later
       *   Sort them from smallest to largest
       *   Reverse that
       *   Create a running sum list using the list from the previous step
       *   Reject the running sums that are larger than the sum of the 12 month amounts divided by two
       *   The length of the remaining running sums list is the top 50
       */

      var runningSum = function(arrayOfNumbers) {
        return _.reduce(arrayOfNumbers, function(memo, num) {
          memo.push(num + (_.last(memo) || 0));
          return memo
        }, []);
      };

      var twelveMonthTotalAmounts = _.pluck(scope.partners, 'twelveMonthTotalAmount');

      var sumOfCurrentPartnersTwelveMonthGiving = d3.sum(twelveMonthTotalAmounts);

      var sortedAmounts = _.sortBy(twelveMonthTotalAmounts, _.identity);

      sortedAmounts.reverse();

      var runningSumOfSortedAmounts = runningSum(sortedAmounts);

      var numOfTopFifty = _.size(_.reject(runningSumOfSortedAmounts, function(num) {
        return num > sumOfCurrentPartnersTwelveMonthGiving / 2;
      }));

      scope.partnersData = [
        {
          key : 'Support Distribution',
          values : [
            {
              label:'Upper 50% Givers',
              value: numOfTopFifty
            },
            {
              label:'Lower 50% Givers',
              value: _.size(scope.partners) - numOfTopFifty
            }
          ]
        }
      ];
    });
  }]);
})();