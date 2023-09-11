'use strict';

(function () {
  angular.module('mpga.current-partners')
    .controller('CurrentPartnersController', ['$scope', 'Partners', 'Resize', function (scope, Partners, Resize) {
    /**
     * This function supports the sorting functionality in the page.
     * @param column
     */
    scope.sortOn = function (column) {
      if (scope.sortingColumn === column) {
        scope.reverse = !scope.reverse;
      } else
        scope.reverse = false;
      scope.arrowDirection = (scope.reverse ? 'ascending' : 'descending'); //CSS class names
      scope.sortingColumn = column;
      scope.active = {};
      scope.active[column] = 'sorting'; //CSS class name
    };

    Resize.resizeIframe();

    Partners.fetch(scope).then(function (partners) {
      /**
       * scope.partners contains donors who have given in the past 12 months.
       * @type Array
       */
      scope.partners = _.reject(partners, scope.isLostPartner);
      Resize.resizeIframe();
    });
  }]);
})();
