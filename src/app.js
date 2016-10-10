 var myProduct = angular.module("myProducts",['ngRoute','angularLazyImg','ui.bootstrap','uiSlider']);
    myProduct.config(function($routeProvider,$locationProvider){

    $routeProvider.
        when('/',{
            templateUrl:'templates/product-list.html',
            controller:'ProductList'
        }).
        when('/:productName',{
            templateUrl:'templates/product-details.html',
            controller:'ProductDetail'
        }).
        otherwise({
            redirectTo:'/'
        });
    })
    .controller("FrmController", function($scope){
          $scope.comment = [];
                $scope.btn_add = function() {
                    if($scope.txtcomment !=''){
                    $scope.comment.push($scope.txtcomment);
                    $scope.txtcomment = "";
                    }
                }

                $scope.remItem = function($index) {
                    $scope.comment.splice($index, 1);
                }
    })
    .controller("ProductList", function($scope, $http){
         $http.get('src/products.json').success(function(data){
             $scope.products = data;
         });
      $scope.lower_price_bound = 0;
      $scope.upper_price_bound = 500;

      $scope.priceRange = function(item) {
        return (parseInt(item['minAway']) >= $scope.lower_price_bound && parseInt(item['maxAway']) <= $scope.upper_price_bound);
      };
     })
     .controller("ProductDetail", function($scope, $routeParams, $http){
         $scope.name = $routeParams.productName;

          $http.get('src/products.json').success(function(data){
               $scope.product = data.filter(function(entry){
                  return entry.name === $scope.name;
              })[0];
          });
     });