'use strict';

/* Directives */
(function () {
  var d3CruColorScale16 = function(i) {
    var darkBlue = "#0a7292";
    var redOrange = "#de7c00";
    var yellow = "#ecb926";
    var lightBlue = "#3eb1c8";
    return [
      d3.rgb(darkBlue).brighter(1),
      d3.rgb(redOrange).brighter(1),
      d3.rgb(yellow).brighter(1),
      d3.rgb(lightBlue).brighter(1),
      d3.rgb(darkBlue).brighter(2),
      d3.rgb(redOrange).brighter(2),
      d3.rgb(yellow).brighter(2),
      d3.rgb(lightBlue).brighter(2),
      d3.rgb(darkBlue),
      d3.rgb(redOrange),
      d3.rgb(yellow),
      d3.rgb(lightBlue),
      d3.rgb(darkBlue).darker(1),
      d3.rgb(redOrange).darker(1),
      d3.rgb(yellow).darker(1),
      d3.rgb(lightBlue).darker(1)
    ][i];
  };

  angular.module('mpgaDirectives', []).
    directive('nvPiechart',function () {
      return {
        scope:{
          input:'='
        },
        link:function (scope, element, attrs) {
          scope.$watch('input', function(newInput, oldInput) {
            if(!newInput) {
              return;
            }

            nv.addGraph(function() {
              var chart = nv.models.pieChart()
                .x(function(d) { return d.label })
                .y(function(d) { return d.value })
                .showLabels(true);

              d3.select(element[0])
                .datum(scope.input)
                .transition().duration(1200)
                .call(chart);

              return chart;
            });
          });
        }
      }
    }).
    directive('nvBarchart',function () {
      return {
        scope:{
          input:'='
        },
        link:function (scope, element, attrs) {
          scope.$watch('input', function(newInput, oldInput) {
            if(!newInput) {
              return;
            }

            nv.addGraph(function() {
              var chart = nv.models.discreteBarChart()
                .x(function(d) { return d.label })
                .y(function(d) { return d.value })
                .tooltips(false)
                .showValues(true);

              chart.yAxis
                .tickFormat(d3.format(',.0f'));

              chart.valueFormat(d3.format(',.0f'));

              d3.select(element[0])
                .datum(scope.input)
                .transition().duration(500)
                .call(chart);

              nv.utils.windowResize(chart.update);

              return chart;
            });

          });
        }
      }
    }).
    directive('totalIncomeExpenses',function () {
      return {
        scope:{
          totalIncome:'=',
          totalExpenses:'='
        },
        link:function (scope, element, attrs) {
          scope.$watch(function() {
            return angular.toJson(scope.totalIncome + scope.totalExpenses);
          }, function(newInput, oldInput) {
            if(!_.isNumber(scope.totalIncome)
              || !_.isNumber(scope.totalExpenses)) {
              return;
            }

            var data = [
              {
                key : 'Income/Expenses',
                values : [
                  {
                    label : 'Income',
                    value : scope.totalIncome
                  },
                  {
                    label : 'Expenses',
                    value : scope.totalExpenses
                  }
                ]
              }
            ];

            nv.addGraph(function() {
              var chart = nv.models.discreteBarChart()
                .x(function(d) { return d.label })
                .y(function(d) { return d.value })
                .tooltips(false)
                .showValues(true);

              chart.yAxis
                .tickFormat(d3.format(',.0f'));

              chart.valueFormat(d3.format(',.0f'));

              d3.select(element[0])
                .datum(data)
                .transition().duration(500)
                .call(chart);

              nv.utils.windowResize(chart.update);

              return chart;
            });
          });
        }
      }
    });
})();