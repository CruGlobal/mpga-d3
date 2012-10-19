'use strict';

(function () {
  angular.module('mpga', ['mpgaControllers', 'mpgaFilters', 'mpgaServices', 'mpgaDirectives']).
    config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
      when('/current-partners', { templateUrl:'partials/current-partners.html', controller:'CurrentPartnersController'}).
      when('/lost-partners', { templateUrl:'partials/lost-partners.html', controller:'LostPartnersController'}).
      when('/statistical-analysis', { templateUrl:'partials/statistical-analysis.html', controller:'StatisticalAnalysisController'}).
      when('/giving-range', { templateUrl:'partials/giving-range.html', controller:'GivingRangeController'}).
      when('/giving-frequency', { templateUrl:'partials/giving-frequency.html', controller:'GivingFrequencyController'}).
      when('/expenses', { templateUrl:'partials/expenses.html', controller:'ExpensesController'}).
      otherwise({redirectTo:'/current-partners'});
  }]).
    run(['$rootScope', function (rootScope) {
    rootScope.isLostPartner = function (partner) {
      return partner.twelveMonthTotalCount == 0;
    }
  }]);
})();



