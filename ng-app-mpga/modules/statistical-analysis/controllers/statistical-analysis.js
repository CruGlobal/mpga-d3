'use strict';

(function () {
  angular.module('mpga.statistical-analysis')
    .controller('StatisticalAnalysisController', ['$scope', '$filter', 'Partners', function (scope, filter, Partners) {
      var amount = filter('amount');
      scope.singleGivers = [];
      scope.multipleGivers = [];
      scope.totalCurrentPartners = [];
      scope.newCurrentLostData = [];

      Partners.fetch(scope).then(function (partners) {
        var lostPartners = _.filter(partners, scope.isLostPartner);

        var newPartners = _.filter(partners, function (partnerRow) {
          // is their first gift in the past year?
          return moment().diff(moment(partnerRow.firstTransactionDate), 'years') == 0;
        });

        scope.newCurrentLostData = [
          {
            key : 'Partner Status Breakdown',
            values : [
              { 'label':'Lost Partners', 'value':_.size(lostPartners)},
              { 'label':'New Partners', 'value':_.size(newPartners)},
              { 'label':'Current Partners', 'value':_.size(partners) - ( _.size(lostPartners) + _.size(newPartners) )}
            ]
          }
        ];

        scope.multipleGivers = _.filter(partners, function (partnerRow) {
          return parseInt(partnerRow.twelveMonthTotalCount) > 1;
        });
        scope.singleGivers = _.filter(partners, function (partnerRow) {
          return parseInt(partnerRow.twelveMonthTotalCount) == 1;
        });
        scope.totalCurrentPartners = _.union(scope.multipleGivers, scope.singleGivers);

        scope.multipleGiversGiftCount = _.chain(scope.multipleGivers).
          pluck('twelveMonthTotalCount').
          reduce(function (a, b) {
            return parseInt(a) + parseInt(b);
          }).
          value();
        scope.singleGiversGiftCount = _.chain(scope.singleGivers).
          pluck('twelveMonthTotalCount').
          reduce(function (a, b) {
            return parseInt(a) + parseInt(b);
          }).
          value();
        scope.totalGiftCount = scope.multipleGiversGiftCount + scope.singleGiversGiftCount;

        scope.multipleGiversTotalAmount = amount(scope.multipleGivers);
        scope.singleGiversTotalAmount = amount(scope.singleGivers);
        scope.totalAmount = scope.multipleGiversTotalAmount + scope.singleGiversTotalAmount;


        scope.multipleSingleData = [
          {
            key : 'Repeat Giving Distribution',
            values : [
              {
                label:'Multiple Givers',
                value:_.size(scope.multipleGivers)
              },
              {
                label:'Single Givers',
                value:_.size(scope.singleGivers)
              }
            ]
          }
        ];
      });
    }])
})();