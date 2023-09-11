'use strict';

(function () {
  angular.module('mpga.lost-partners')
  .controller('LostPartnersController', ['$scope', 'Partners', 'Resize', function (scope, Partners, Resize) {
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
      scope.lostPartners = _.filter(partners, scope.isLostPartner);
      Resize.resizeIframe();
    });
  }])
})();
