'use strict';

/* Directives */
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
    }).
    directive('incomeExpensesByMonth',function () {
      return {
        scope:{
          income:'=',
          expenses:'='
        },
        link:function (scope, element, attrs) {
          scope.$watch(function() {
            return angular.toJson(scope.income + scope.expenses);
          }, function(newInput, oldInput) {
            if(!_.isArray(scope.income) || _.size(scope.income) == 0
              || !_.isArray(scope.expenses) || _.size(scope.expenses) == 0) {

              return;
            }

            var months = _.map(_.range(12), function (monthsToAdd) {
                return moment().subtract('years', 1).add('months', monthsToAdd);
            });

            var transformAndSum = function(incomeOrExpenses, sign) {
              return _.map(months, function(month) {
                return {
                  label:month.format('MMM'),
                  value:_.chain(_.filter(incomeOrExpenses, function(monthDatum) {
                    return monthDatum.month === month.format('YYYY-MM');
                  })).
                    map(function (monthDatum) {
                      return _.chain(monthDatum.transactionSummaries).
                        pluck('amount').
                        value();
                    }).
                    flatten().
                    reduce(function (a, b) {
                      return a + b;
                    }, 0).
                    value() * sign
                }
              });
            };
            var incomeByMonth = transformAndSum(scope.income, 1);
            var expensesByMonth = transformAndSum(scope.expenses, -1);

            var data = [
              {
                key : 'Income/Expenses',
                values :_.flatten(_.zip(incomeByMonth, expensesByMonth))
              }
            ];

            nv.addGraph(function() {
              var chart = nv.models.discreteBarChart()
                .x(function(d) { return d.label })
                .y(function(d) { return d.value })
                .tooltips(false)
                .staggerLabels(false)
                .showValues(true);

              chart.yAxis
                .tickFormat(d3.format(',.0f'));

              chart.valueFormat(d3.format(',.0f'));

              chart.color(function(d, i) {
                return i % 2 == 0 ? 'lightGreen' : 'lightPink';
              });

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