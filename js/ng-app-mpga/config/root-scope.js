'use strict';

(function () {
  angular.module('mpga')
  .run(['$rootScope', function (rootScope) {
    rootScope.isLostPartner = function (partner) {
      var oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      oneYearAgo.setDate(1);
      oneYearAgo.setHours(0, 0, 0, 0);
      var partnerLastTransactionDate = new Date(partner.lastTransactionDate);

      return partnerLastTransactionDate.getTime() <= oneYearAgo.getTime();
    }
  }]);
})();



