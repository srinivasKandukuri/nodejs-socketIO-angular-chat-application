var app=angular.module('myApp',[]);
	
		app.controller('mainController',['$scope','$window',function($scope,$window){
                
                var isLogged = $window.localStorage.getItem('isLogged');
                $scope.users = [];
                $scope.isLogged = (isLogged) ? true : false; 
                $scope.error_user = false;
                var socket = io.connect();

                
                    
                    socket.on('connect', function() {
                        console.log('connected to server');
                        if($scope.isLogged){
                            let params =JSON.parse($window.localStorage.getItem('params'));
                            socket.emit('join',params, function(err) {
                                if(err){
                                    alert(err);
                                }else{

                                }
                            });
                        }
                        
                    });
                


                $scope.joinRoom = function(username,room){
                    $window.localStorage.setItem('params', JSON.stringify({username,room}));
                    socket.emit('validateUser', {username,room}, function(val){
                        if(val == true){
                            $window.localStorage.setItem('isLogged',true);
                           
                            $scope.$apply(function () {
                                $scope.isLogged = true;
                            }); 

                            let params =JSON.parse($window.localStorage.getItem('params'));
                            socket.emit('join',params, function(err) {
                                if(err){
                                    alert(err);
                                }else{

                                }
                            });

                        }else{
                           
                            $scope.$apply(function () {
                                $scope.error_user = true;
                            }); 
                        }
                    });
                }


                socket.on('updateUserList',function(users){
                    $scope.$apply(function () {
                        $scope.users = users;
                    }); 
                    
                });


                $scope.send = function(message){
                    
                }



		}]);
			