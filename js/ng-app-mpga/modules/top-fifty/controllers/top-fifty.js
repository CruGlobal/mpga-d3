;
(function () {
  'use strict';

  angular.module('mpga.top-fifty')
    .controller('TopFiftyController', ['$scope', 'Partners', 'Resize',
      function(scope, Partners, Resize) {
        Resize.resizeIframe();
        Partners.fetch(scope).then(function (partners) {
          /**
           * scope.partners contains donors who have given in the past 12 months.
           * @type Array
           */
          scope.partners = _.reject(partners, scope.isLostPartner);

          /*
           * The algorithm for the 50/50 pie chart is as follows:
           *   Sort all partners based on twelveMonthTotalAmount, largest to smallest
           *   Sum the twelveMonthTotalAmounts
           *   Create a running sum as a new field on the partners
           *   Reject the running sums that are larger than the sum of the 12 month amounts divided by two
           *
           */

          var amountField = 'twelveMonthTotalAmount';
          var cumSumField = 'twelveMonthTotalAmountCumSum';
          var sortedPartners = _.sortBy(scope.partners, amountField);

          var sumOfTwelveMonthGiving = _.reduce(_.pluck(scope.partners, amountField), function(a, b) { return a + b; }, 0);

          var cumSumPartners = function(arrayOfPartners) {
            return _.reduce(arrayOfPartners, function(memo, partner, index, list) {
              partner[cumSumField] = partner[amountField]
              if(index > 0) {
                partner[cumSumField] += list[index - 1][cumSumField];
              }
              memo.push(partner);
              return memo;
            }, []);
          };

          var sortedPartnersWithCumSum = cumSumPartners(sortedPartners);

          var fiftyPercentilePredicate = function(partner) {
            return partner[cumSumField] > (sumOfTwelveMonthGiving / 2);
          };
          scope.upperFiftyPercentile = _.filter(sortedPartnersWithCumSum, fiftyPercentilePredicate);
          scope.upperFiftyPercentile.reverse();

          scope.lowerFiftyPercentile = _.reject(sortedPartnersWithCumSum, fiftyPercentilePredicate);
          scope.lowerFiftyPercentile.reverse();

          scope.partnersData = [
            {
              key : 'Support Distribution',
              values : [
                {
                  label:'Upper 50% Givers',
                  value: _.size(scope.upperFiftyPercentile)
                },
                {
                  label:'Lower 50% Givers',
                  value: _.size(scope.lowerFiftyPercentile)
                }
              ]
            }
          ];

          Resize.resizeIframe();
        })
      }])
})();
