'use strict';

/* Controllers */
(function () {
  angular.module('mpgaControllers', []).
    controller('CurrentPartnersController', ['$scope', 'Partners', function (scope, Partners) {
    scope.sortOn = function (column) {
      if (scope.sortingColumn === column) {
        scope.reverse = !scope.reverse;
      } else
        scope.reverse = false;
      scope.arrowDirection = (scope.reverse ? 'descending' : 'ascending'); //CSS class names
      scope.sortingColumn = column;
      scope.active = {};
      scope.active[column] = 'sorting'; //CSS class name
    };

    Partners.fetch(scope).then(function (partners) {
      scope.partners = _.reject(partners, scope.isLostPartner);

      _.mixin({
        median : function(sortedArrayOfNumbers) {
          return d3.median(sortedArrayOfNumbers);
        }
      });

      scope.medianYearlyAmount = _.chain(scope.partners)
        .pluck('twelveMonthTotalAmount')
        .map(function(stringOfAmount){
          return parseFloat(stringOfAmount);
        })
        .sortBy(_.identity)
        .median()
        .value();

      var upperHalf = function(partner) {
        return parseFloat(partner.twelveMonthTotalAmount) > scope.medianYearlyAmount;
      };

      scope.partnersData = [
        {
          key : 'Support Distribution',
          values : [
            {
              label:'Upper 50% Givers',
              value:_.size(_.filter(partners, upperHalf))
            },
            {
              label:'Lower 50% Givers',
              value:_.size(_.reject(partners, upperHalf))
            }
          ]
        }
      ];
    });
  }]).
    controller('LostPartnersController', ['$scope', 'Partners', function (scope, Partners) {
    scope.sortOn = function (column) {
      if (scope.sortingColumn === column) {
        scope.reverse = !scope.reverse;
      } else
        scope.reverse = false;
      scope.arrowDirection = (scope.reverse ? 'descending' : 'ascending'); //CSS class names
      scope.sortingColumn = column;
      scope.active = {};
      scope.active[column] = 'sorting'; //CSS class name
    };

    Partners.fetch(scope).then(function (partners) {
      scope.lostPartners = _.filter(partners, scope.isLostPartner);
    });
  }]).
    controller('StatisticalAnalysisController', ['$scope', '$filter', 'Partners', function (scope, filter, Partners) {
    var amount = filter('amount');
    scope.singleGivers = [];
    scope.multipleGivers = [];
    scope.totalCurrentPartners = [];
    scope.newCurrentLostData = [];

    Partners.fetch(scope).then(function (partners) {
      var lostPartners = _.filter(partners, scope.isLostPartner);

      var newPartners = _.filter(partners, function (partnerRow) {
        // is their first gift in the past year?
        return moment().diff(moment(partnerRow.firstTransactionDate), 'years') == 0;
      });

      scope.newCurrentLostData = [
        {
          key : 'Partner Status Breakdown',
          values : [
            { 'label':'Lost Partners', 'value':_.size(lostPartners)},
            { 'label':'New Partners', 'value':_.size(newPartners)},
            { 'label':'Current Partners', 'value':_.size(partners) - ( _.size(lostPartners) + _.size(newPartners) )}
          ]
        }
      ];

      scope.multipleGivers = _.filter(partners, function (partnerRow) {
        return parseInt(partnerRow.twelveMonthTotalCount) > 1;
      });
      scope.singleGivers = _.filter(partners, function (partnerRow) {
        return parseInt(partnerRow.twelveMonthTotalCount) == 1;
      });
      scope.totalCurrentPartners = _.union(scope.multipleGivers, scope.singleGivers);

      scope.multipleGiversGiftCount = _.chain(scope.multipleGivers).
        pluck('twelveMonthTotalCount').
        reduce(function (a, b) {
          return parseInt(a) + parseInt(b);
        }).
        value();
      scope.singleGiversGiftCount = _.chain(scope.singleGivers).
        pluck('twelveMonthTotalCount').
        reduce(function (a, b) {
          return parseInt(a) + parseInt(b);
        }).
        value();
      scope.totalGiftCount = scope.multipleGiversGiftCount + scope.singleGiversGiftCount;

      scope.multipleGiversTotalAmount = amount(scope.multipleGivers);
      scope.singleGiversTotalAmount = amount(scope.singleGivers);
      scope.totalAmount = scope.multipleGiversTotalAmount + scope.singleGiversTotalAmount;


      scope.multipleSingleData = [
        {
          key : 'Repeat Giving Distribution',
          values : [
            {
              label:'Multiple Givers',
              value:_.size(scope.multipleGivers)
            },
            {
              label:'Single Givers',
              value:_.size(scope.singleGivers)
            }
          ]
        }
      ];
    });
  }]).
    controller('GivingRangeController', ['$scope', '$filter', 'Partners', function (scope, filter, Partners) {
    scope.ranges = [
      {high:10000000, low:200},
      {high:200, low:150},
      {high:150, low:100},
      {high:100, low:75},
      {high:75, low:50},
      {high:50, low:25},
      {high:25, low:10},
      {high:10, low:0}
    ];

    var amount = filter('amount');
    var rangeBandPass = filter('rangeBandPass');
    Partners.fetch(scope).then(function (partners) {
      scope.currentPartners = _.reject(partners, scope.isLostPartner);

      scope.totalCount = _.size(scope.currentPartners);

      scope.totalAmount = amount(scope.currentPartners);

      scope.chartData = [
        {
          key : 'Giving Range',
          values : _.map(scope.ranges, function(range) {
            return {
              label: '$' + range.low + '+',
              value:_.size(rangeBandPass(scope.currentPartners, range))
            };
          })
        }
      ];
    });
  }]).
    controller('GivingFrequencyController', ['$scope', '$filter', 'Partners', function (scope, filter, Partners) {
    scope.ranges = [
      {label:'1 Gift', high:1, low:1},
      {label:'2-4 Gifts', high:4, low:2},
      {label:'5-6 Gifts', high:6, low:5},
      {label:'7-10 Gifts', high:10, low:7},
      {label:'11-12 Gifts', high:12, low:11},
      {label:'13+ Gifts', high:1000000, low:13}
    ];


    var amount = filter('amount');
    var frequencyBandPass = filter('frequencyBandPass');
    Partners.fetch(scope).then(function (partners) {
      scope.currentPartners = _.reject(partners, scope.isLostPartner);

      scope.totalCount = _.size(scope.currentPartners);

      scope.totalAmount = amount(scope.currentPartners);

      scope.chartData = [
        {
          key : 'Giving Range',
          values : _.map(scope.ranges, function(range) {
            return {
              label:range.label,
              value:_.size(frequencyBandPass(scope.currentPartners, range))
            };
          })
        }
      ];
    });
  }]).
    controller('ExpensesController', ['$scope', 'Expenses', 'Income', function (scope, Expenses, Income) {
    scope.months = _.map(_.range(12), function (monthsToAdd) {
      var month = moment().subtract('years', 1).add('months', monthsToAdd);

      // Sorry, this is a bit weird.
      // Display the year only if it's the first column in the expenses table
      //   (the first month of last year that we are displaying)
      // OR
      // January of the current year
      var displayYear = monthsToAdd === 0 || month.format('M') === '1';

      return {
        shortName : month.format('MMM'),
        yearMonthKey : month.format('YYYY-MM'),
        year : displayYear ? month.format('YYYY') : '',
        style : month.year() === moment().year() ? 'header_two' : 'header_one'
      };
    });

    var pullOutMatchingDescriptions = function (expenseItems, predicate) {
      if(_.isUndefined(predicate))
        predicate = _.identity;

      return _.chain(expenseItems).
        map(function (monthDatum) {
          return _.chain(monthDatum.transactionSummaries).
            filter(predicate).
            pluck('description').
            value();
        }).
        flatten().
        unique().
        value();
    };

    var sumUpMonthData = function(monthData, predicate) {
      return _.chain(monthData).
        map(function (monthDatum) {
          return _.chain(monthDatum.transactionSummaries).
            filter(predicate).
            pluck('amount').
            value();
        }).
        flatten().
        reduce(function (a, b) {
          return a + b;
        }, 0).
        value();
    };

    scope.income = [];

    Income.fetch(scope).then(function (income) {
      scope.income = income;

      var allIncomeDescriptions = pullOutMatchingDescriptions(income);
      //Need to move Contributions to the beginning, hence the union
      var cont = 'Contributions';
      scope.incomeDescriptions = _.union([cont], _.without(allIncomeDescriptions, cont));

      scope.totalIncome = sumUpMonthData(income, _.identity);
    });

    scope.expenses = [];


    Expenses.fetch(scope).then(function (expenses) {
      scope.expenses = expenses;

      //ministry is category === ministry-reimbursement
      var ministryPredicate = function (transactionSummary) {
        return transactionSummary.category === 'ministry-reimbursement';
      };
      scope.ministryDescriptions = pullOutMatchingDescriptions(expenses, ministryPredicate);

      //ministry is category === healthcare-reimbursement
      var healthcareReimbursementPredicate = function (transactionSummary) {
        return transactionSummary.category === 'healthcare-reimbursement';
      };
      scope.healthcareDescriptions = pullOutMatchingDescriptions(expenses, healthcareReimbursementPredicate);


        //last table is `category in (benefits, salary, contributions-assessment)`
      var beneSalCont = ['benefits', 'salary', 'contributions-assessment'];
      var beneSalContPredicate = function (transactionSummary) {
        return _.contains(beneSalCont, transactionSummary.category);
      };
      scope.benefitsDescriptions = pullOutMatchingDescriptions(expenses, beneSalContPredicate);

      //misc has everything else
      var miscPredicate = function (transactionSummary) {
        return !ministryPredicate(transactionSummary) &&
          !beneSalContPredicate(transactionSummary) &&
          !healthcareReimbursementPredicate(transactionSummary);
      };
      scope.miscDescriptions = pullOutMatchingDescriptions(expenses, miscPredicate);

      scope.totalExpenses = sumUpMonthData(expenses, _.identity);

      scope.expensesPieData = [
        {
          key : 'Expenses',
          values : [
            {
              label:'Salary',
              value: sumUpMonthData(expenses, function (transactionSummary) {
                return transactionSummary.category === 'salary';
              })
            },
            {
              label:'Misc',
              value:sumUpMonthData(expenses, miscPredicate)
            },
            {
              label:'Benefits',
              value:sumUpMonthData(expenses, function (transactionSummary) {
                return transactionSummary.category === 'benefits';
              })
            },
            {
              label:'Assessment',
              value:sumUpMonthData(expenses, function (transactionSummary) {
                return transactionSummary.category === 'contributions-assessment';
              })
            },
            {
              label:'Ministry Expenses',
              value:sumUpMonthData(expenses, ministryPredicate)
            },
            {
              label:'Healthcare Expenses',
              value:sumUpMonthData(expenses, healthcareReimbursementPredicate)
            }
          ]
        }
      ];
    });
  }]).
    controller('NavigationController', ['$scope', '$location', function (scope, location) {
    scope.navClass = function (page) {
      var currentRoute = location.path().substring(1) || 'current-partners';
      return (page === currentRoute) ? 'active' : '';
    }
  }]);
})();