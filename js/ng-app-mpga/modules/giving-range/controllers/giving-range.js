'use strict';

(function () {
  angular.module('mpga.giving-range')
    .controller('GivingRangeController', ['$scope', '$filter', 'Partners', 'Resize', function (scope, filter, Partners, Resize) {
      scope.ranges = [
        {high:10000000, low:200},
        {high:200, low:150},
        {high:150, low:100},
        {high:100, low:75},
        {high:75, low:50},
        {high:50, low:25},
        {high:25, low:10},
        {high:10, low:0}
      ];

      var amount = filter('amount');
      var rangeBandPass = filter('rangeBandPass');
      Resize.resizeIframe();
      Partners.fetch(scope).then(function (partners) {
        scope.currentPartners = _.reject(partners, scope.isLostPartner);

        scope.totalCount = _.size(scope.currentPartners);

        scope.totalAmount = amount(scope.currentPartners);

        scope.chartData = [
          {
            key : 'Giving Range',
            values : _.map(scope.ranges, function(range) {
              return {
                label: '$' + range.low + '+',
                value:_.size(rangeBandPass(scope.currentPartners, range))
              };
            })
          }
        ];
        Resize.resizeIframe();
      });
    }])
})();
