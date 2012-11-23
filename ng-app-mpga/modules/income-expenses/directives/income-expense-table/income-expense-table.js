'use strict';

(function () {
  angular.module('mpga.income-expenses')
    .directive('incomeExpenseTable', function () {
      return {
        replace : true,
        scope : {
          inputDescriptions:'=',
          inputData:'=',
          months:'='
        },
        templateUrl:'ng-app-mpga/modules/income-expenses/directives/income-expense-table/templates/table.html'
      }
    })
})();