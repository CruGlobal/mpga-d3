'use strict';

(function () {
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
                .tooltips(true)
                .tooltipContent(function(key, y, e, graph) {
                  return '<div class="pie-tooltip">' +
                    '<span class="pie-value">' + y + ' Partners' + '</span> ' +
                    '</div>';
                })
                .showLabels(false);

              chart.valueFormat(d3.format(',.0f'));

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

              chart.color(['#1f77b4', '#aec7e8']);

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
    });
})();