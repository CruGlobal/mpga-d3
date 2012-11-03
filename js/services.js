'use strict';


(function () {
  var mockServiceData = true;

  /* Services */
  var mpgaServicesModule = angular.module('mpgaServices', ['ngResource']).
    service('EasyXdm', ['$q', '$cacheFactory', function($q, $cacheFactory){

//    var schemeHostAndPort = 'http://localhost:8680';
      var schemeHostAndPort = 'http://hart-a321.net.ccci.org:9980';
      var corsUrl = schemeHostAndPort + '/wsapi/easyXDM/cors/';
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
                deferred.reject(message);
              }

              function sendRequestToUrl(retryOnUnauthorized) {
                xhr.request({
                  url:url,
                  method:"GET"
                }, function (response) {
                  if (response.status == 200) {
                    handleSuccessfulResponse(response);
                  }
                  else {
                    //TODO: what to do here?
                    handleFailedRequest(response);
                  }
                }, function (errorPayload){
                  var message = errorPayload.message;
                  var response = errorPayload.data;
                  if (retryOnUnauthorized && response != undefined && response.status == 401) {
                    handleNotAuthorizedResponse();
                  }
                  else
                  {
                    handleFailedRequest(response);
                  }
                });
              }

              function handleNotAuthorizedResponse() {
                reloadXhr();

                var loggedInToCas = xhr.request({
                  url:"/wsapi/rest/authentication/loggedInToCas",
                  method:"GET"
                }, function (response) {
                  if (response.data === "true") {
                    var retryOnUnauthorized = false;
                    sendRequestToUrl(retryOnUnauthorized);
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