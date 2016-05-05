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

    $scope.showBoxMenu = function() {
      moduleScope.shown = moduleScope.shown ? false : true;
    }

    moduleScope.modules = getModules();

    function getModules() {
      var modules = [];

      function processChild(url, index) {
        url = url.replace('#', '');

        structureService.getModule(url).then(function(module) {
          var backgroundImage = moduleConfig.backgroundImages[index];
          var backgroundColor = moduleConfig.backgroundColors[index];

          modules.push({
            text: module.name,
            icon: module.icon,
            url: '#' + url,
            backgroundColor: (backgroundColor) ? backgroundColor : '',
            backgroundImage: (backgroundImage) ? backgroundImage : ''
          });
        });
      }

      angular.forEach(moduleConfig.menuItems, processChild);

      return modules;
    }
  }

}());
