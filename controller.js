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
      var tempUrl = angular.copy($rootScope.backUrl);
      if (tempUrl.length - 2 > -1) {
        $rootScope.backUrl.pop();
        $location.path(tempUrl[tempUrl.length - 2]);
      }
    };

    var moduleScope = $scope.topmenu;
    var moduleConfig = $scope.topmenu.modulescope;

    if(moduleConfig.backgroundImage)
    $scope.gridStyle = {
      "background-image":"url(" + moduleConfig.backgroundImageUrl + ")",
      "background-repeat": "no-repeat",
      "background-size": "cover",
      "background-position": "center"
    };


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
          var color = (value.bgColor) ? value.bgColor : '';
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
