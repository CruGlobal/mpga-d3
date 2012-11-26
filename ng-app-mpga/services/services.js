'use strict';

(function () {
  var mockServiceData = true;

  var mpgaServicesModule = angular.module('mpga.services', ['ngResource']);

  if (mockServiceData) {
    mpgaServicesModule
      .service('Partners', ['EasyXdm', '$resource', '$q', function (EasyXdm, resource, q) {
        return {
          fetch: function (scope) {
            var deferred = q.defer();

            resource('testData.json').query(function (partners) {
              deferred.resolve(partners);
            });

            return deferred.promise;
          }
        }
      }])
      .service('Expenses', ['EasyXdm', '$resource', '$q', function (EasyXdm, resource, q) {
        return {
          fetch: function (scope) {
            var deferred = q.defer();

            resource('example-mpga-expense-data.json').query(function (expenses) {
              deferred.resolve(expenses);
            });

            return deferred.promise;
          }
        }
      }])
      .service('Income', ['EasyXdm', '$resource', '$q', function (EasyXdm, resource, q) {
        return {
          fetch: function (scope) {
            var deferred = q.defer();

            resource('example-mpga-income-data.json').query(function (income) {
              deferred.resolve(income);
            });

            return deferred.promise;
          }
        }
      }])
  }
  else {
    mpgaServicesModule
      .service('Partners', ['EasyXdm', function (EasyXdm) {
        return {
          fetch: function (scope) {
            scope.designation = EasyXdm.fetch(scope, '/wsapi/rest/authentication/my/designation');

            var partnersPromise = scope.designation.then(function (designation) {
              return EasyXdm.fetch(scope, '/wsapi/rest/donors/donorGiftSummariesByMonth?designation=' + designation);
            });

            partnersPromise.then(null, function (error) {
              alert("Sorry, there was an error and your Ministry Partner data could not be retrieved.");
            });

            return partnersPromise;
          }
        }
      }])
      .service('EmployeeIds', ['EasyXdm', '$q', '$rootScope', function (EasyXdm, $q, $rootScope) {
        var myEmployeeId = EasyXdm.fetch($rootScope, '/wsapi/rest/authentication/my/employeeId');

        // TODO: is null the best way to represent 'there is no spouse id' ?
        var mySpouseEmployeeIdOrNull = EasyXdm.fetch($rootScope, '/wsapi/rest/authentication/my/spouse/employeeId').then(
          function (spouseId) {
            return spouseId;
          },
          function (error) {
            if (error.response && error.response.code == 404) {
              return null;
            }
            else {
              return $q.reject(error);
            }
          }
        );

        var bothIds = $q.all([myEmployeeId, mySpouseEmployeeIdOrNull]).then(
          function (employeeIds) {
            return _.compact(employeeIds);
          }
        );

        $rootScope.employeeId = myEmployeeId;
        $rootScope.spouseEmployeeId = mySpouseEmployeeIdOrNull;

        return bothIds;
      }])
      .service('Expenses', ['EasyXdm', 'EmployeeIds', function (EasyXdm, EmployeeIds) {
        return {
          fetch: function (scope) {
            var expensesPromise = EmployeeIds.then(function (employeeIds) {
              return EasyXdm.fetch(scope, '/wsapi/rest/staffAccount/transactionSummariesByMonth?reimbursementDetail=fine&salaryDetail=coarse&transactionType=expense&employeeIds=' + employeeIds.join(','));
            });
            expensesPromise.then(null, function (error) {
              alert("Sorry, there was an error and your Expenses data could not be retrieved.");
            });

            return expensesPromise;
          }
        }
      }])
      .service('Income', ['EasyXdm', 'EmployeeIds', function (EasyXdm, EmployeeIds) {
        return {
          fetch: function (scope) {
            var incomePromise = EmployeeIds.then(function (employeeIds) {
              return EasyXdm.fetch(scope, '/wsapi/rest/staffAccount/transactionSummariesByMonth?firstMonth=2011-10&transactionType=income&employeeIds=' + employeeIds.join(','));
            });

            incomePromise.then(null, function (error) {
              alert("Sorry, there was an error and your Income data could not be retrieved.");
            });

            return incomePromise;
          }
        }
      }])
  }

})();