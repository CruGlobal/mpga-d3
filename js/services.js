'use strict';

(function () {
  /* Services */
  angular.module('mpgaServices', ['ngResource']).
    service('Partners',['EasyXdm', function (EasyXdm) {
		return {
			fetch: function(scope)
			{
				// var designationPromise = EasyXdm.fetch(scope, '/wsapi/rest/authentication/my/designation');
				// return designationPromise.then(function(designation){
				// 	return EasyXdm.fetch(scope, '/wsapi/rest/donors/donorGiftSummariesByMonth?designation=' + designation);
				// });
				return EasyXdm.fetch(scope, '/wsapi/rest/donors/donorGiftSummariesByMonth?designation=0005129');
			}
		}
	}]).
    service('Expenses',function ($resource) {
      return $resource('example-mpga-expense-data.json');
    }).
    service('Income', ['EasyXdm', function (EasyXdm) {
      // return $resource('example-mpga-income-data.json');
		// return {
		// 			fetch: function(scope)
		// 			{
		// 				return EasyXdm.fetch(scope, )
		// 			}
		// 		}
    }]).
	service('EasyXdm', ['$q', function($q){
		return {
			fetch: function(scope, pathAndQueryString){

				//var schemeHostAndPort = 'http://localhost:8680';
				var schemeHostAndPort = 'http://hart-a321.net.ccci.org:9980';
				// var url = schemeHostAndPort + '/wsapi/rest/donors/donorGiftSummariesByMonth?designation=0005129&donorLastGiftDateLowerBound=2009-10-01';
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
				    method: "GET",
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
							var jsonObject = angular.fromJson(data);
							console.log("parsed data")
							console.log(jsonObject)
					        deferred.resolve(jsonObject);
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