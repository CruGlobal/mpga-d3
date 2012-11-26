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

      /**
       * The rest of this callback supports the 50/50 pie chart at the bottom of the page.
       */
      _.mixin({
        average : function(arrayOfNumbers) {
          if(_.isArray(arrayOfNumbers) && arrayOfNumbers.length > 0)
            return d3.sum(arrayOfNumbers) / arrayOfNumbers.length;
          else
            return 0;
        }
      });

      scope.averageYearlyAmount = _.chain(scope.partners)
        .pluck('twelveMonthTotalAmount')
        .map(function(stringOfAmount){
          return parseFloat(stringOfAmount);
        })
        .average()
        .value();

      var upperHalf = function(partner) {
        return parseFloat(partner.twelveMonthTotalAmount) > scope.averageYearlyAmount;
      };

      scope.partnersData = [
        {
          key : 'Support Distribution',
          values : [
            {
              label:'Upper 50% Givers',
              value:_.size(_.filter(scope.partners, upperHalf))
            },
            {
              label:'Lower 50% Givers',
              value:_.size(_.reject(scope.partners, upperHalf))
            }
          ]
        }
      ];
    });
  }]);
})();