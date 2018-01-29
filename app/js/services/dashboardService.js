quantum
.factory('dashboardService', ['$http', '$window', function($http, $window) { 

    var locks = {
        lockLeft : false,
        lockRight : false
    };
    
    function getLock(){
        return locks;
    }

    function setLeftLock(lock){
        locks.lockLeft = lock;
    }

    function setRightLock(lock){
       locks.lockRight = lock; 
    }
    
	return {
        getLock : getLock,
        setRightLock : setRightLock
	}
}]);
