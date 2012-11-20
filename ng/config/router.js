'use strict';

(function () {
  angular.module('mpga', ['mpgaControllers', 'mpgaFilters', 'mpgaServices', 'mpgaDirectives'])
    .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/current-partners', { templateUrl:'ng/templates/current-partners.html', controller:'CurrentPartnersController'})
      .when('/lost-partners', { templateUrl:'ng/templates/lost-partners.html', controller:'LostPartnersController'})
      .when('/statistical-analysis', { templateUrl:'ng/templates/statistical-analysis.html', controller:'StatisticalAnalysisController'})
      .when('/giving-range', { templateUrl:'ng/templates/giving-range.html', controller:'GivingRangeController'})
      .when('/giving-frequency', { templateUrl:'ng/templates/giving-frequency.html', controller:'GivingFrequencyController'})
      .when('/income-expenses', { templateUrl:'ng/templates/income-expenses.html', controller:'IncomeExpensesController'})
      .otherwise({redirectTo:'/current-partners'});
  }])
})();
