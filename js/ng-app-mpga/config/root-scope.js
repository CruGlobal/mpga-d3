'use strict';

(function () {
  angular.module('mpga')
  .run(['$rootScope', '$filter', function (rootScope, filter) {
    rootScope.isLostPartner = function (partner) {
      var oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      var partnerLastTransactionDate = new Date(partner.lastTransactionDate);

      return partnerLastTransactionDate.getTime() <= oneYearAgo.getTime();
    }
  }]);
})();



