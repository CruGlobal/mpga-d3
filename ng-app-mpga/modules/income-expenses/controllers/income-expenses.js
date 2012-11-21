'use strict';

(function () {
  angular.module('mpga.income-expenses')
    .controller('IncomeExpensesController', ['$scope', 'Expenses', 'Income', function (scope, Expenses, Income) {
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
          style : month.year() === moment().year() ? 'header_two' : 'header_one',
          styleColor : month.year() === moment().year() ? 'header_two_color' : 'header_one_color'
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


        //last table is `category in (benefits, salary, contributions-assessment, additional-salary)`
        var benefitsSalaryContributions = ['benefits', 'salary', 'contributions-assessment', 'additional-salary'];
        var benefitsSalaryContributionsPredicate = function (transactionSummary) {
          return _.contains(benefitsSalaryContributions, transactionSummary.category);
        };
        scope.benefitsDescriptions = pullOutMatchingDescriptions(expenses, benefitsSalaryContributionsPredicate);

        //misc has everything else
        var miscPredicate = function (transactionSummary) {
          return !ministryPredicate(transactionSummary) &&
            !benefitsSalaryContributionsPredicate(transactionSummary) &&
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
                label:'Additional Salary',
                value: sumUpMonthData(expenses, function (transactionSummary) {
                  return transactionSummary.category === 'additional-salary';
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
    }])
})();