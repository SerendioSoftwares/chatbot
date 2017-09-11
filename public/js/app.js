var app = angular.module('chatbot',[]);

app.controller('MainCtrl',['$scope', function($scope){
    $scope.message ='hello!! Good morning!!';
    $scope.address = window.address;
    $scope.products = window.products;
    $scope.customer = window.customer;

}]);

app.controller('OrderCtrl',['$scope', function($scope){
    $scope.message ='This is order controller';
    $scope.address = window.address;
    $scope.products = window.products;
    $scope.customer = window.customer;
    $scope.customerinfo = window.customerinfo;
    //console.log(products);
    //console.log(address);
}]);
