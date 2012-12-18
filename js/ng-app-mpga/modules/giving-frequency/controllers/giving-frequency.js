'use strict';

(function () {
  angular.module('mpga.giving-frequency')
    .controller('GivingFrequencyController', ['$scope', '$filter', 'Partners', function (scope, filter, Partners) {
      scope.ranges = [
        {label:'1 Gift', high:1, low:1},
        {label:'2-4 Gifts', high:4, low:2},
        {label:'5-6 Gifts', high:6, low:5},
        {label:'7-10 Gifts', high:10, low:7},
        {label:'11-12 Gifts', high:12, low:11},
        {label:'13+ Gifts', high:1000000, low:13}
      ];


      var amount = filter('amount');
      var frequencyBandPass = filter('frequencyBandPass');
      Partners.fetch(scope).then(function (partners) {
        scope.currentPartners = _.reject(partners, scope.isLostPartner);

        scope.totalCount = _.size(scope.currentPartners);

        scope.totalAmount = amount(scope.currentPartners);

        scope.chartData = [
          {
            key : 'Giving Range',
            values : _.map(scope.ranges, function(range) {
              return {
                label:range.label,
                value:_.size(frequencyBandPass(scope.currentPartners, range))
              };
            })
          }
        ];
      });
    }]);
})();