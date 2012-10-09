'use strict';

angular.module('mpga', ['mpgaFilters', 'mpgaServices']).
  config(['$routeProvider', function ($routeProvider) {
  $routeProvider.
    when('/current-partners', { templateUrl:'partials/current-partners.html', controller: CurrentPartnersController}).
    otherwise({redirectTo:'/current-partners'});
}]);

/* Controllers */
function CurrentPartnersController(scope, Partners) {
  scope.partners = currentPartners(Partners.query());

}
CurrentPartnersController.$inject = ['$scope', 'Partners'];

/* Filters */
angular.module('mpgaFilters', []).
  filter('formatCurrency', function () {
  return formatCurrency;
}).
filter('formatDate', function() {
    return function(epochTime) {
      var date = new Date(epochTime);
      return date.getMonth() + '/' + date.getDay() + '/' + date.getFullYear();
    }
  });

/* Services */
angular.module('mpgaServices', ['ngResource']).
  factory('Partners', function ($resource) {
    return $resource('testData.json');
  });

/*
var data;

d3.json('testData.json', function (json) {
    data = json;

    var tr = d3.select('.container')
      .append('table').attr('class', 'table-striped')
      .append('tbody')
      .selectAll('tr')
      .data(json)
      .enter()
      .append('tr');

    tr.append('td').text(function(d) {
        return d.accountName;
    });
    tr.append('td').text(function(d) {
        return d.accountNumber;
    });
    tr.append('td').text(function(d) {
        return formatCurrency(d['12MonthTotalAmount']);
    });
});
*/
