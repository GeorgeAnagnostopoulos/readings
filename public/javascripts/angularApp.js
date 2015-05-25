angular.module('myApp', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	$stateProvider
	    .state('home', {
		url:'/home',
		templateUrl: '/home.html',
		controller:'HomeController',
		resolve: {
		    readingPromise: ['Readings', function(Readings) {

			return Readings.getAll();
		    }]
		}
	    })
	    .state('readings', {
		url: '/readings/{id}',
		templateUrl: '/readings.html',
		controller:'ReadingsController',
		resolve: {
		    reading: ['$stateParams', 'Readings', function($stateParams, Readings) {

			return Readings.getReading($stateParams.id);
		    }]
		}
	    });
	$urlRouterProvider.otherwise('home');
    }])
    .run(['$rootScope', function($rootScope) {
	$rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {

	    console.log(event, current, previous, rejection)
	})
    }])
    .factory('Readings', ['$http', function($http) {

	var o = {
	    readings:[]
	};

	o.saveReading = function(reading) {

	    return $http.put('/api/readings/' + reading._id).then(function( res) {

		return res.data;
	    });
	};
	
	o.getReading = function getReading(id) {

	    return $http.get('/api/readings/' + id).then(function(res) {

		return res.data;
	    });
	};
	
	o.getAll = function getAll() {

	    return $http.get('/api/readings').success(function successGetAll(data) {

		angular.copy(data, o.readings);
	    });
	};

	o.create = function readingCreate(reading) {

	    return $http.post('/api/readings', reading).success(function successCreate(data) {

		o.readings.push(data);
	    });
	};
			  
	return o;
    }])
    .controller('HomeController', ['$scope', '$state', 'Readings', function($scope, $state, Readings) {

	$scope.readings = Readings.readings;

	$scope.addReading = function() {

	    if (!$scope.title || $scope.title === '')
		return;
	    
	    Readings.create({
		title:$scope.title,
		link: $scope.link,
		description: $scope.description,
		notes: $scope.notes,
		tags: $scope.tags.split(',')
	    });
	    $scope.title = '';
	    $scope.link = '';
	    $scope.description = '';
	    $scope.notes = '';
	    $scope.tags = '';
	};

	$scope.editReading = function(reading) {

	    $state.go('readings', {id:reading._id});
	};
	
	$scope.removeReading = function(index) {

	    $scope.readings.splice(index, 1);
	};
    }])
    .controller('ReadingsController', ['$scope', '$state', 'Readings', 'reading',
       function ReadingsController($scope, $state, Readings, reading) {

	   $scope.reading = {
	       _id: reading._id,
	       title: reading.title,
	       link: reading.link,
	       description: reading.description,
	       notes: reading.notes,
	       tags: reading.tags.map(function(item, index, array) {
		   return item.toString() + ',';
	       })
	   };

	   $scope.editReading = function() {
	       Readings.saveReading($scope.reading);
	       $state.go('home');
	   };
    }]);
