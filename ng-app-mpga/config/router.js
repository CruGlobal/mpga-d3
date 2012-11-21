'use strict';

(function () {
  angular.module('mpga', ['mpgaControllers', 'mpgaFilters', 'mpgaServices', 'mpgaDirectives'])
    .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/current-partners',
      {
        templateUrl:'ng-app-mpga/templates/current-partners.html',
        controller:'CurrentPartnersController'
      })
      .when('/lost-partners', { templateUrl:'ng-app-mpga/templates/lost-partners.html', controller:'LostPartnersController'})
      .when('/statistical-analysis', { templateUrl:'ng-app-mpga/templates/statistical-analysis.html', controller:'StatisticalAnalysisController'})
      .when('/giving-range', { templateUrl:'ng-app-mpga/templates/giving-range.html', controller:'GivingRangeController'})
      .when('/giving-frequency', { templateUrl:'ng-app-mpga/templates/giving-frequency.html', controller:'GivingFrequencyController'})
      .when('/income-expenses', { templateUrl:'ng-app-mpga/templates/income-expenses.html', controller:'IncomeExpensesController'})
      .otherwise({redirectTo:'/current-partners'});
  }])
})();
