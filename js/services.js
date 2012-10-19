'use strict';

(function () {
  /* Services */
  angular.module('mpgaServices', ['ngResource']).
    factory('Partners',function ($resource) {
      return $resource('testData.json');
    }).
    factory('Expenses',function ($resource) {
      return $resource('example-mpga-expense-data.json');
    }).
    factory('Income', function ($resource) {
      return $resource('example-mpga-income-data.json');
    });
})();