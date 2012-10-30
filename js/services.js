'use strict';


(function () {
  var mockServiceData = true;

  /* Services */
  var mpgaServicesModule = angular.module('mpgaServices', ['ngResource']).
    service('EasyXdm', ['$q', function($q){

//    var schemeHostAndPort = 'http://localhost:8680';
      var schemeHostAndPort = 'http://hart-a321.net.ccci.org:9980';
      var corsUrl = schemeHostAndPort + '/wsapi/easyXDM/cors/';

      var xhr = new easyXDM.Rpc({
          remote: corsUrl
      }, {
          remote: {
              request: {} // request is exposed by /cors/
          }
      });

      return {
            fetch: function(scope, pathAndQueryString){
                var deferred = $q.defer();

                var url = schemeHostAndPort + pathAndQueryString;

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

  if (mockServiceData) {
  mpgaServicesModule.
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
  }])
  }
  else
  {
  mpgaServicesModule.service('Partners', ['EasyXdm', function (EasyXdm) {
    return {
      fetch: function(scope)
      {
        scope.designation=EasyXdm.fetch(scope, '/wsapi/rest/authentication/my/designation');

        return scope.designation.then(function(designation){
          return EasyXdm.fetch(scope, '/wsapi/rest/donors/donorGiftSummariesByMonth?designation=' + designation);
        });
      }
    }
  }]).
    service('Expenses', ['EasyXdm', function (EasyXdm) {
    return {
      fetch: function(scope)
      {
        scope.employeeId=EasyXdm.fetch(scope, '/wsapi/rest/authentication/my/employeeId');

        return scope.employeeId.then(function(employeeId){
          return EasyXdm.fetch(scope, '/wsapi/rest/staffAccount/transactionSummariesByMonth?firstMonth=2011-10&transactionType=expense&employeeId=' + employeeId + '&reimbursementDetail=fine&salaryDetail=coarse');
        });
      }
    }
  }]).
    service('Income', ['EasyXdm', function (EasyXdm) {
    return {
      fetch: function(scope)
      {
        scope.employeeId=EasyXdm.fetch(scope, '/wsapi/rest/authentication/my/employeeId');

        return scope.employeeId.then(function(employeeId){
          return EasyXdm.fetch(scope, '/wsapi/rest/staffAccount/transactionSummariesByMonth?firstMonth=2011-10&transactionType=income&employeeId=' + employeeId);
        });
      }
    }
  }])
  };
})();