'use strict';

(function () {
  /* Services */
  angular.module('mpgaServices', ['ngResource']).
    service('Partners', ['EasyXdm', '$resource', '$q', function (EasyXdm, resource, q) {
    return {
      fetch: function(scope)
      {
        var deferred = q.defer();

        resource('testData.json').query(function(partners) {
          deferred.resolve(partners);
        });

        return deferred.promise;
      }
    }
  }]).
    service('Expenses', ['EasyXdm', '$resource', '$q', function (EasyXdm, resource, q) {
    return {
      fetch: function(scope)
      {
        var deferred = q.defer();

        resource('example-mpga-expense-data.json').query(function(expenses) {
          deferred.resolve(expenses);
        });

        return deferred.promise;
      }
    }
  }]).
    service('Income', ['EasyXdm', '$resource', '$q', function (EasyXdm, resource, q) {
    return {
      fetch: function(scope)
      {
        var deferred = q.defer();

        resource('example-mpga-income-data.json').query(function(income) {
          deferred.resolve(income);
        });

        return deferred.promise;
      }
    }
  }]).
//    service('Partners', ['EasyXdm', function (EasyXdm) {
//    return {
//      fetch: function(scope)
//      {
//        return EasyXdm.fetch(scope, '/wsapi/rest/donors/donorGiftSummariesByMonth?designation=0005129');
//      }
//    }
//  }]).
//    service('Expenses', ['EasyXdm', function (EasyXdm) {
//    return {
//      fetch: function(scope)
//      {
//        scope.employeeId=EasyXdm.fetch(scope, '/wsapi/rest/authentication/my/employeeId');
//
//        return scope.expenses=scope.employeeId.then(function(employeeId){
//          return EasyXdm.fetch(scope, '/wsapi/rest/staffAccount/transactionSummariesByMonth?firstMonth=2011-08&transactionType=expense&employeeId=' + employeeId + '&reimbursementDetail=fine&salaryDetail=coarse');
//        });
//      }
//    }
//  }]).
//    service('Income', ['EasyXdm', function (EasyXdm) {
//    return {
//      fetch: function(scope)
//      {
//        scope.employeeId=EasyXdm.fetch(scope, '/wsapi/rest/authentication/my/employeeId');
//
//        return scope.expenses=scope.employeeId.then(function(employeeId){
//          return EasyXdm.fetch(scope, '/wsapi/rest/staffAccount/transactionSummariesByMonth?firstMonth=2011-08&transactionType=income&employeeId=' + employeeId + '&reimbursementDetail=fine&salaryDetail=coarse');
//        });
//      }
//    }
//  }]).
    service('EasyXdm', ['$q', function($q){
    return {
      fetch: function(scope, pathAndQueryString){

//				var schemeHostAndPort = 'http://localhost:8680';
        var schemeHostAndPort = 'http://hart-a321.net.ccci.org:9980';
//				var url = schemeHostAndPort + '/wsapi/rest/donors/donorGiftSummariesByMonth?designation=0005129&donorLastGiftDateLowerBound=2009-10-01';
        var url = schemeHostAndPort + pathAndQueryString;
        var corsUrl = schemeHostAndPort + '/wsapi/easyXDM/cors/';

        var xhr = new easyXDM.Rpc({
          remote: corsUrl
        }, {
          remote: {
            request: {} // request is exposed by /cors/
          }
        });

        var deferred = $q.defer();

        xhr.request({
          url: url,
          method: "GET"
        }, function(response) {
          scope.$apply(function() {
            if (response.status == 200)
            {
              var data = response.data;
              var contentType = response.headers["Content-Type"];
              var resolution;
              if (contentType == 'plain/text')
                resolution = data;
              else
              {
                resolution = angular.fromJson(data);
              }
              deferred.resolve(resolution);
            }
            else
            {
              deferred.reject("Invocation Errors Occurred and the status is " + response.status + " when calling " + url);
            }
          });
        });

        return deferred.promise;
      }
    };
  }]);
})();