'use strict';

angular.module('mpga', ['mpgaFilters', 'mpgaServices', 'mpgaDirectives']).
  config(['$routeProvider', function ($routeProvider) {
  $routeProvider.
    when('/current-partners', { templateUrl:'partials/current-partners.html', controller: CurrentPartnersController}).
    when('/lost-partners', { templateUrl:'partials/lost-partners.html', controller: LostPartnersController}).
//    when('/giving-range', { templateUrl:'partials/giving-range.html', controller: GivingRangeController}).
//    when('/giving-frequency', { templateUrl:'partials/giving-frequency.html', controller: GivingFrequencyController}).
    otherwise({redirectTo:'/current-partners'});
}]);

/* Controllers */
function CurrentPartnersController(scope, Partners) {
  scope.partners = currentPartners(Partners.query());

  scope.pieData = [
    { 'label':'top 50', 'value':16},
    { 'label':'bottom 50', 'value':107} ];
}
CurrentPartnersController.$inject = ['$scope', 'Partners'];

function LostPartnersController(scope, Partners) {
  scope.partners = Partners.query();

  scope.lostPartners = dataSplitter(scope.partners).lostPartners;
}
LostPartnersController.$inject = ['$scope', 'Partners'];

function NavigationController(scope, location) {
  scope.a = location.path().substring(1);


  scope.navClass = function (page) {
    var currentRoute = location.path().substring(1) || 'current-partners';
    return (page === currentRoute) ? 'active' : '';
  }
}
NavigationController.$inject = ['$scope', '$location'];

/* Filters */
angular.module('mpgaFilters', []).
  filter('formatCurrency', function () { return formatCurrency; }).
  filter('formatDate', function() { return formatDate; });

/* Services */
angular.module('mpgaServices', ['ngResource']).
  factory('Partners', function ($resource) {
    return $resource('testData.json');
  });

/* Directives */
angular.module('mpgaDirectives', []).
  directive('piechart', function() {
    var width = 300,
      height = 300,
      radius = 100,
      color = d3.scale.category20();

    return {
      restrict: 'A',
      terminal: false,
      localModel:'=piechart',
      /*scope: {
        aoeu: '='
      },*/
      link: function(scope, element, attrs) {
        var vis = d3.select(element[0])
          .append("svg:svg")              //create the SVG element inside the <body>
          .data([scope.pieData])                   //associate our data with the document
          .attr("width", width)           //set the width and height of our visualization (these will be attributes of the <svg> tag
          .attr("height", height)
          .append("svg:g")                //make a group to hold our pie chart
          .attr("transform", "translate(" + radius + "," + radius + ")")    //move the center of the pie chart from 0, 0 to radius, radius

        var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
          .outerRadius(radius);

        var pie = d3.layout.pie()           //this will create arc data for us given a list of values
          .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array

        var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
          .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
          .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
          .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
          .attr("class", "slice");    //allow us to style things in the slices (like text)

        arcs.append("svg:path")
          .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
          .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

        arcs.append("svg:text")                                     //add a label to each slice
          .attr("transform", function(d) {                    //set the label's origin to the center of the arc
            //we have to make sure to set these before calling arc.centroid
            d.innerRadius = 0;
            d.outerRadius = radius;
            return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
          })
          .attr("text-anchor", "middle")                          //center the text on it's origin
          .text(function(d, i) { return scope.pieData[i].label; });        //get the label from our original data array
      }
    }
  });
