(function() {
  'use strict';

  angular
    .module('topmenu', [])
    .controller('TopMenuController', TopMenuController);

  TopMenuController.$inject = ['$scope', '$rootScope', '$location', 'structureService'];

  function TopMenuController($scope, $rootScope, $location, structureService) {
    // Register upper level modules
    structureService.registerModule($location, $scope, 'topmenu');

    $scope.showBack = false;

    if(structureService.getMenuItems().indexOf($location.$$path) === -1 && $rootScope.current != 'topmenu'){
      $scope.showBack = true;
    }
    $scope.goBack = function() {
      window.history.back()
    };

    var moduleScope = $scope.topmenu;
    var moduleConfig = $scope.topmenu.modulescope;

    $scope.showTopMenu = function() {
      moduleScope.shown = moduleScope.shown ? false : true;
    }
    $rootScope.currentIndex = -1;

    moduleScope.modules = getModules();

    function getModules() {
      var modules = [];

      function processChild(value, index) {

        if( $location.path() === value.path ){
          $rootScope.currentIndex = index;
        }

        structureService.getModule(value.path).then(function(module) {
          var color = (value.bgColor) ? '#' + value.bgColor.replace('#','') : '';
          modules.push({
            text: module.name,
            icon: module.icon,
            url: '#' + value.path,
            backgroundImage: value.bgImage,
            backgroundColor: color
          });
        });
      }

      angular.forEach(moduleConfig.menuItems, processChild);

      return modules;
    }
  }

}());
