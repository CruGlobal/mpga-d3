'use strict';

(function () {
  angular.module('mpga')
  .run(['$rootScope', function (rootScope) {
    rootScope.isLostPartner = function (partner) {
      return partner.twelveMonthTotalCount == 0;
    }
  }]);
})();



