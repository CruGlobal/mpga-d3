'use strict';

/* Directives */
(function () {
  angular.module('mpgaDirectives', []).
    directive('piechart',function () {
      var width = 300,
        height = 300,
        radius = 100,
        color = d3.scale.category20();

      return {
        restrict:'A',
        scope:{
          input:'='
        },
        link:function (scope, element, attrs) {
          var vis = d3.select(element[0])
            .append("svg:svg")//create the SVG element inside the element
            .data([scope.input])//associate our data with the document
            .attr("width", width)//set the width and height of our visualization (these will be attributes of the <svg> tag
            .attr("height", height)
            .append("svg:g")//make a group to hold our pie chart
            .attr("transform", "translate(" + radius + "," + radius + ")")    //move the center of the pie chart from 0, 0 to radius, radius

          var arc = d3.svg.arc()//this will create <path> elements for us using arc data
            .outerRadius(radius);

          var pie = d3.layout.pie()//this will create arc data for us given a list of values
            .value(function (d) {
              return d.value;
            });    //we must tell it out to access the value of each element in our data array

          var arcs = vis.selectAll("g.slice")//this selects all <g> elements with class slice (there aren't any yet)
            .data(pie)//associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
            .enter()//this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
            .append("svg:g")//create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
            .attr("class", "slice");    //allow us to style things in the slices (like text)

          arcs.append("svg:path")
            .attr("fill", function (d, i) {
              return color(i);
            })//set the color for each slice to be chosen from the color function defined above
            .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

          arcs.append("svg:text")//add a label to each slice
            .attr("transform", function (d) {                    //set the label's origin to the center of the arc
              //we have to make sure to set these before calling arc.centroid
              d.innerRadius = 0;
              d.outerRadius = radius;
              return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "middle")//center the text on it's origin
            .text(function (d, i) {
              return scope.input[i].label;
            });        //get the label from our original data array
        }
      }
    }).
    directive('barchart', function () {
      var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 300 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom,
        radius = 100,
        color = d3.scale.category20();

      return {
        restrict:'A',
        scope:{
          input:'=',
          yLabel:'='
        },
        link:function (scope, element, attrs) {
          var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

          var y = d3.scale.linear()
            .range([height, 0]);

          var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

          var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(",.0f"));

          var svg = d3.select(element[0])
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          x.domain(scope.input.map(function (d) {
            return d.label;
          }));
          y.domain([0, d3.max(scope.input, function (d) {
            return d.value;
          })]);

          svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

          svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(scope.yLabel);

          svg.selectAll(".bar")
            .data(scope.input)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
              return x(d.label);
            })
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
              return y(d.value);
            })
            .attr("height", function (d) {
              return height - y(d.value);
            });
        }
      }
    });
})();