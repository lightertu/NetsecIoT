var testbedApp = angular.module('testbedApp', ['appRoutes'])
    .controller("deviceViewController", function($scope) {
        $scope.devices = [
            {
                name: "SAMR-X21",
                services: [
                    { path: "/sensor/temperature", method: 0 },
                    { path: "/actuator/led", method: 4 }
                ]
                
            },

            {
                name: "Raspberry Pi",
                services: [
                    { path: "/sensor/temperature", method: 0 },
                    { path: "/actuator/led", method: 4 }
                ]
                
            }
        ];
    });

