'use strict';

/* Controllers */
(function () {
  angular.module('mpgaControllers', [])
    .controller('NavigationController', ['$scope', '$location', function (scope, location) {
      scope.navClass = function (page) {
        var currentRoute = location.path().substring(1) || 'current-partners';
        return (page === currentRoute) ? 'active' : '';
      }
    }]);
})();