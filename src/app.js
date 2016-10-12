 var myProduct = angular.module('myProducts', ['ngAnimate', 'ngTouch','ngRoute','angularLazyImg','uiSlider'])
	.config(function($routeProvider,$locationProvider){
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
           $http.get('src/products.json').success(function(data){
        
            $scope.slides = $scope.product.images;
            
            $scope.direction = 'left';
            $scope.currentIndex = 0;

            $scope.setCurrentSlideIndex = function (index) {
                $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
                $scope.currentIndex = index;
            };

            $scope.isCurrentSlideIndex = function (index) {
                return $scope.currentIndex === index;
            };

            $scope.prevSlide = function () {
                $scope.direction = 'left';
                $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
            };

            $scope.nextSlide = function () {
                $scope.direction = 'right';
                $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
            };
        }); 
     })
    .animation('.slide-animation', function () {
        return {
            beforeAddClass: function (element, className, done) {
                var scope = element.scope();

                if (className == 'ng-hide') {
                    var finishPoint = element.parent().width();
                    if(scope.direction !== 'right') {
                        finishPoint = -finishPoint;
                    }
                    TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done });
                }
                else {
                    done();
                }
            },
            removeClass: function (element, className, done) {
                var scope = element.scope();

                if (className == 'ng-hide') {
                    element.removeClass('ng-hide');

                    var startPoint = element.parent().width();
                    if(scope.direction === 'right') {
                        startPoint = -startPoint;
                    }

                    TweenMax.fromTo(element, 0.5, { left: startPoint }, {left: 0, onComplete: done });
                }
                else {
                    done();
                }
            }
        };
    });

