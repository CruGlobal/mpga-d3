'use strict';


(function () {
  var mockServiceData = true;

  /* Services */
  var mpgaServicesModule = angular.module('mpgaServices', ['ngResource']).
    service('EasyXdm', ['$q', '$cacheFactory', function($q, $cacheFactory){

      function log(something)
      {
        if ( console.log ) {
          if (something != undefined)
            console.log(something);
        }
      }


      var schemeHostAndPort = 'http://localhost:8680';
//      var schemeHostAndPort = 'http://hart-a321.net.ccci.org:9980';
//      var schemeHostAndPort = 'https://wsapistaging.ccci.org';

      var xhr;

      reloadXhr();

      /**
       * as a side effect, this re-requests (if necessary) a new ticket from CAS, since the iframe url
       * is protected by the cas filter.
       */
      function reloadXhr()
      {
        var corsUrl = schemeHostAndPort + '/wsapi/easyXDM/cors/';
        xhr = new easyXDM.Rpc({
          remote: corsUrl
        }, {
          remote: {
            request: {} // request is exposed by /cors/
          }
        });
      }

      var cache = $cacheFactory('EasyXdm-Cache');

      return {
            fetch: function(scope, pathAndQueryString){
              var deferred = $q.defer();

              var url = schemeHostAndPort + pathAndQueryString;

              function handleSuccessfulResponse(response) {
                var data = response.data;
                var contentType = response.headers["Content-Type"];
                var resolution;
                if (contentType == 'plain/text')
                  resolution = data;
                else {
                  resolution = angular.fromJson(data);
                }
                deferred.resolve(resolution);
                cache.put(pathAndQueryString, resolution);
              }

              function handleFailedRequest(response) {
                log("request to " + url + " failed.");
                var message;
                if (response)
                {
                  log(response);
                  message = "Request failed; response code is " + response.status + " when calling " + url;
                }
                else
                {
                  message = "Request failed; no response given";
                }
                var error = {
                  message: message,
                  response: response,
                  url: url
                };

                deferred.reject(error);
              }

              function sendRequestToUrl(retryOnUnauthorized) {
                xhr.request({
                  url:url,
                  method:"GET"
                }, function (response) {
                  scope.$apply(function() {
                    if (response.status == 200) {
                      handleSuccessfulResponse(response);
                    }
                    else {
                      //TODO: what to do here?
                      handleFailedRequest(response);
                    }
                  });
                }, function (errorPayload){
                  scope.$apply(function() {
                    var response = errorPayload.data;
                    if (retryOnUnauthorized && response != undefined && response.status == 401) {
                      handleNotAuthorizedResponse();
                    }
                    else
                    {
                      handleFailedRequest(response);
                    }
                  });
                });
              }

              function handleNotAuthorizedResponse() {
                reloadXhr();

                var loggedInToCas = xhr.request({
                  url:"/wsapi/rest/authentication/loggedInToCas",
                  method:"GET"
                }, function (response) {
                  if (response.data === "true") {
                    sendRequestToUrl(false);
                  }
                  else {
                    alert("It appears you are not logged in to Relay.  Attempting to reload the page...");
                    deferred.reject("User is not logged in");
                    window.top.location.reload();
                  }
                }, function (errorPayload){
                  var message = errorPayload.message;
                  var response = errorPayload.data;
                  log("unable to check if logged in to cas: " + message);
                  log(response);
                  deferred.reject("Unable to check if logged in to cas; response code " + response.status);
                });
              }

              if (cache.get(pathAndQueryString) == undefined)
              {
                sendRequestToUrl(true);
              }
              else
              {
                var resolution = cache.get(pathAndQueryString);
                deferred.resolve(resolution);
              }

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

        var partnersPromise = scope.designation.then(function(designation){
          return EasyXdm.fetch(scope, '/wsapi/rest/donors/donorGiftSummariesByMonth?designation=' + designation);
        });

        partnersPromise.then(null, function(error){
          alert("Sorry, there was an error and your Ministry Partner data could not be retrieved.");
        });

        return partnersPromise;
      }
    }
  }]).
  service('EmployeeIds', ['EasyXdm', '$q', '$rootScope', function (EasyXdm, $q, $rootScope) {
    var myEmployeeId = EasyXdm.fetch($rootScope, '/wsapi/rest/authentication/my/employeeId');

    // TODO: is null the best way to represent 'there is no spouse id' ?
    var mySpouseEmployeeIdOrNull = EasyXdm.fetch($rootScope, '/wsapi/rest/authentication/my/spouse/employeeId').then(
      function(spouseId){
        return spouseId;
      },
      function(error){
        if (error.response && error.response.code == 404)
        {
          return null;
        }
        else
        {
          return $q.reject(error);
        }
      }
    );

    var bothIds = $q.all([myEmployeeId, mySpouseEmployeeIdOrNull]).then(
      function(employeeIds){
        return _.compact(employeeIds);
      }
    );

    $rootScope.employeeId=myEmployeeId;
    $rootScope.spouseEmployeeId=mySpouseEmployeeIdOrNull;

    return bothIds;
  }]).
    service('Expenses', ['EasyXdm', 'EmployeeIds', function (EasyXdm, EmployeeIds) {
    return {
      fetch: function(scope)
      {
        var expensesPromise = EmployeeIds.then(function(employeeIds){
          return EasyXdm.fetch(scope, '/wsapi/rest/staffAccount/transactionSummariesByMonth?reimbursementDetail=fine&salaryDetail=coarse&transactionType=expense&employeeIds=' + combineEmployeeIdsIntoString(employeeIds));
        });
        expensesPromise.then(null, function(error){
          alert("Sorry, there was an error and your Expenses data could not be retrieved.");
        });

        return expensesPromise;
      }
    }
  }]).
    service('Income', ['EasyXdm', 'EmployeeIds', function (EasyXdm, EmployeeIds) {
    return {
      fetch: function(scope)
      {
        var incomePromise = EmployeeIds.then(function(employeeIds){
          return EasyXdm.fetch(scope, '/wsapi/rest/staffAccount/transactionSummariesByMonth?firstMonth=2011-10&transactionType=income&employeeIds=' + combineEmployeeIdsIntoString(employeeIds));
        });

        incomePromise.then(null, function(error){
          alert("Sorry, there was an error and your Income data could not be retrieved.");
        });

        return incomePromise;
      }
    }
  }])
  }

  function combineEmployeeIdsIntoString(employeeIds) {
    //TODO: there is probably a nicer way to do this
    return _.reduce(
      employeeIds,
      function (memo, employeeId) {
        return memo === 'start-token' ? employeeId : memo + "," + employeeId;
      },
      'start-token');
  }

})();