'use strict';

(function () {
  /* Services */
  angular.module('mpgaServices', ['ngResource']).
    service('Partners', ['EasyXdm', function (EasyXdm) {
		return {
			fetch: function(scope)
			{
				scope.designation = EasyXdm.fetch(scope, '/wsapi/rest/authentication/my/designation');
				return scope.designation.then(function(designation){
					return EasyXdm.fetch(scope, '/wsapi/rest/donors/donorGiftSummariesByMonth?designation=' + designation);
				});
//				return EasyXdm.fetch(scope, '/wsapi/rest/donors/donorGiftSummariesByMonth?designation=0005129');
			}
		}
	}]).
    service('Expenses', ['EasyXdm', function (EasyXdm) {
        return {
            fetch: function(scope)
            {
                scope.employeeId=EasyXdm.fetch(scope, '/wsapi/rest/authentication/my/employeeId');

                return scope.employeeId.then(function(employeeId){
                    return EasyXdm.fetch(scope, '/wsapi/rest/staffAccount/transactionSummariesByMonth?firstMonth=2011-08&transactionType=expense&employeeId=' + employeeId + '&reimbursementDetail=fine&salaryDetail=coarse');
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
                  return EasyXdm.fetch(scope, '/wsapi/rest/staffAccount/transactionSummariesByMonth?firstMonth=2011-08&transactionType=income&employeeId=' + employeeId + '&reimbursementDetail=fine&salaryDetail=coarse');
              });
          }
      }
    }]).
	service('EasyXdm', ['$q', function($q){
        //var schemeHostAndPort = 'http://localhost:8680';
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

                //var url = schemeHostAndPort + '/wsapi/rest/donors/donorGiftSummariesByMonth?designation=0005129&donorLastGiftDateLowerBound=2009-10-01';
                var url = schemeHostAndPort + pathAndQueryString;

				xhr.request({
				    url: url,
				    method: "GET"
				}, function(response) {
		//		    alert(response.status);
		//		    alert(response.data);
					scope.$apply(function() {
			       	 	if (response.status == 200)
				        {
			//				console.log(response.data);

				            // invocationResponseText = document.createTextNode(response.data);
				            // var textDiv = document.getElementById("textDiv");
				            // textDiv.appendChild(invocationResponseText);

							var data = response.data;
							console.log("got back data")
                            var contentType = response.headers["Content-Type"];
                            console.log("content type: " + contentType);
                            var resolution;
                            if (contentType == 'plain/text')
                                resolution = data;
                            else
                            {
                                resolution = angular.fromJson(data);
                                console.log("parsed data")
                            }
                            console.log(resolution)
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

	}])
;
})();