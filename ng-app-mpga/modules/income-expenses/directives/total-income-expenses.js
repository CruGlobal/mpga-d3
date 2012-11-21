'use strict';

(function () {
  angular.module('mpga.income-expenses')
    .directive('totalIncomeExpenses',function () {
      return {
        scope:{
          totalIncome:'=',
          totalExpenses:'='
        },
        link:function (scope, element, attrs) {
          scope.$watch(function() {
            return angular.toJson(scope.totalIncome + scope.totalExpenses);
          }, function(newInput, oldInput) {
            if(!_.isNumber(scope.totalIncome) || !_.isNumber(scope.totalExpenses)) {
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