quantum.controller('sectionCtrl', function($scope, $routeParams,procedureService,userService,timeService,$interval) {
	$scope.params = $routeParams;
	$scope.role = userService.userRole;
    $scope.name = userService.getUserName();
    $scope.usernamerole =  $scope.name +"("+$scope.role.cRole.callsign+")";

    $scope.clock = {
        utc : "000.00.00.00 UTC"
    }

    $scope.updateClock = function(){
  		$scope.clock = timeService.getTime(0);
  	}

    $scope.interval = $interval($scope.updateClock, 500);
    var currentRevision;
	viewProcedure();

	function viewProcedure(){
    	procedureService.getProcedureList().then(function(response){
    		if(response){
                for(var i=0;i<response.data.length;i++){
                    if(response.data[i].procedure.id === $scope.params.procID){
                        procedureService.setProcedureName($scope.params.procID,response.data[i].procedure.title,"Live");
                    }
                }
            }
    	});

        procedureService.getProcedureList().then(function(response) {
            for(var i=0;i<response.data.length;i++){
                if(parseFloat(response.data[i].procedure.id).toFixed(1) === $scope.params.procID){
                   	$scope.steps = response.data[i].procedure.sections;
				}
			}

	        for(var j=0;j<$scope.steps.length;j++){
	            if($scope.steps[j].Step.includes(".0") === true && $scope.steps[j].Step.indexOf(".") === $scope.steps[j].Step.lastIndexOf(".")){
	                $scope.steps[j].index = parseFloat($scope.steps[j].Step);
	                $scope.steps[j].class = "fa fa-caret-right";
	                $scope.steps[j].header = true; 
	                $scope.steps[j].headertype = "mainheader";
	                $scope.steps[j].headervalue = $scope.steps[j].Step.split(".")[0];
	                $scope.steps[j].openstatus = true;
	                $scope.steps[j].rowstyle = {
	                    rowcolor: {backgroundColor:'#e9f6fb'}
	                };
	                $scope.steps[j].chkval = false;

	            }else if($scope.steps[j].Step.includes(".0") === true && $scope.steps[j].Step.indexOf(".") !== $scope.steps[j].Step.lastIndexOf(".")){
	                $scope.steps[j].index = parseFloat($scope.steps[j].Step);
	                $scope.steps[j].class = "fa fa-caret-down";
	                $scope.steps[j].header = true; 
	                $scope.steps[j].headertype = "subheader";
	                $scope.steps[j].headervalue = $scope.steps[j].Step.split(".")[0];
	                $scope.steps[j].openstatus = false;
	                $scope.steps[j].rowstyle = {
	                	rowcolor: {
	                		backgroundColor:'#e9f6fb'
	                	}
	                };
	                $scope.steps[j].chkval = false;
	            }else {
	                $scope.steps[j].index = parseFloat($scope.steps[j].Step);
	                $scope.steps[j].class = "fa fa-caret-right"; 
	                $scope.steps[j].header = false;
	                $scope.steps[j].headertype = "listitem";
	                $scope.steps[j].headervalue = $scope.steps[j].Step.split(".")[0];
	                $scope.steps[j].openstatus = false;
	                $scope.steps[j].rowstyle = {
	                    rowcolor: {backgroundColor:'#e9f6fb'}
	                };
	                    $scope.steps[j].chkval = false;
	            }  
	        }

	        //set type icon 
	        for(var k=0;k<$scope.steps.length;k++){
	            if($scope.steps[k].Type === "Heading"){

	            }else if($scope.steps[k].Type === "Warning"){
	                $scope.steps[k].typeicon = "fa fa-exclamation-triangle";
	            }else if($scope.steps[k].Type === "Caution"){
	                $scope.steps[k].typeicon = "fa fa-exclamation-circle";
				}else if($scope.steps[k].Type === "Record"){
	                $scope.steps[k].typeicon = "fa fa-pencil-square-o";
				}else if($scope.steps[k].Type === "Verify"){
	                $scope.steps[k].typeicon = "fa fa-check-circle-o";
				}else if($scope.steps[k].Type === "Action"){
	                $scope.steps[k].typeicon = "fa fa-cog";
				}else if($scope.steps[k].Type === "Decision"){
	                $scope.steps[k].typeicon = "fa fa-dot-circle-o";
				}
	        }

	        //check for role and disable the steps if not permitted
	        for(var a=0;a<$scope.steps.length;a++){
	            if($scope.steps[a].Role.includes($scope.role.cRole.callsign)){
	                $scope.steps[a].status = false;
	            }else {
	                $scope.steps[a].status = true;
	            }
	        }

    	});
	}

    $scope.showPList = function(id,index,headertype){
        if(headertype === "mainheader"){
            if($scope.steps[id].class === "fa fa-caret-down"){
                $scope.steps[id].class = "fa fa-caret-right"
                for(var i=0;i<$scope.steps.length;i++){
                    if(index === parseInt($scope.steps[i].headervalue) && $scope.steps[i].headertype === "subheader" || $scope.steps[i].headertype === "listitem"){
                        $scope.steps[i].openstatus = false;
                    }
                }
            }else if($scope.steps[id].class === "fa fa-caret-right"){
                $scope.steps[id].class = "fa fa-caret-down"
                for(var i=0;i<$scope.steps.length;i++){
                    if(index === parseInt($scope.steps[i].headervalue)){
                        $scope.steps[i].openstatus = true;
                    }
                }
            }

        }else if(headertype === "subheader"){
            if($scope.steps[id].class === "fa fa-caret-down"){
                $scope.steps[id].class = "fa fa-caret-right"
                for(var i=0;i<$scope.steps.length;i++){
                    if(index === $scope.steps[i].index && $scope.steps[i].headertype === "listitem" ){
                        $scope.steps[i].openstatus = false;   
                    }
                }
            }else if($scope.steps[id].class === "fa fa-caret-right"){
                $scope.steps[id].class = "fa fa-caret-down"
                for(var i=0;i<$scope.steps.length;i++){
                    if(index === $scope.steps[i].index && $scope.steps[i].headertype === "listitem" ){
                        $scope.steps[i].openstatus = true;   
                    }
                }
            }
        }
    }

    $scope.setInfo = function(index,stepstatus){
        if(stepstatus === true){
            $scope.steps[index].rowstyle = {
                rowcolor : {backgroundColor:'#c6ecc6'}
          	}
            var stepInfoStatus = checkIfEmpty($scope.steps);
            if(stepInfoStatus === true){
                procedureService.saveProcedureInstance($scope.params.procID,$scope.usernamerole,$scope.clock.utc).then(function(response){
	                if(response.status === 200){
	                    currentRevision = response.data.revision;
	                    $scope.steps[index].Info = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
	                    procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,response.data.revision);
	                    openNextSteps($scope.steps,index);
	                }
            	});
                	
        	}else{
	            $scope.steps[index].Info = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
	            procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,currentRevision);
	            openNextSteps($scope.steps,index);
        	}
    	}else{
            $scope.steps[index].Info = "";
            $scope.steps[index].rowstyle = {
                rowcolor : {backgroundColor:'#e9f6fb'}
                }
            procedureService.setInfo("",$scope.params.procID,index,$scope.usernamerole,currentRevision);
        }

    }

    function checkIfEmpty(steps){
        var stepcount = 0;
        for(var i=0;i<steps.length;i++){
        	if(steps[i].Info === undefined){
        		stepcount++;
        	}
        }
        if(stepcount === steps.length){
        	return true;
        }else {
        	return false;
        }
    }

    function openNextSteps(steps,index){
        var newindex = index+1;
        if(steps[index].headertype === "mainheader"){
        	while(steps[newindex].headertype !== "mainheader"){
        		steps[newindex].openstatus = true;
        		steps[index].class = "fa fa-caret-down"
        		if(newindex === steps.length-1){
        			break;
        		}else {
        			newindex = newindex+1;
        		}	
        	}
		}else if(steps[index].headertype === "subheader"){
        	while(steps[newindex].headertype !== "mainheader"){
        		steps[newindex].openstatus = true;
        		steps[index].class = "fa fa-caret-down";
        		if(newindex === steps.length-1){
        			break;
        		}else {
        			newindex = newindex+1;
        		}	
        	}
        }else if(steps[index].headertype === "listitem"){
        	if(steps[newindex].headertype === "mainheader"){
        		steps[newindex].openstatus = true;
        		steps[index].class = "fa fa-caret-down";
        		var newind = newindex+1;
        		while(steps[newind].headertype !== "mainheader"){
        			steps[newind].openstatus = true;
        			if(newind === steps.length-1){
        				break;
        			}else {
        				newind = newind+1;
        			}
        		}
        	}
        }
    }
});


