var app = angular.module("LinkedLiving", []);

app.controller("user-info-controller", function($scope,$http){
  
  var url = "http://50.174.197.248:89/api/get_user_info";
  
  var request_parameters = {
    user_id:123
  };
  
  var options = {
    params: request_parameters
  };
  
  var request = $http.get(url, options);
  request.success(function(json_data){
    //callback function to be called when response is ready
    //console.log(json_data);
    $scope.user_info = json_data;
    //
  });
});//initiate at the beginning to register later after DOM tree
 
app.controller("health-info-controller", function($scope,$http){
  $scope.current_date = Date.now();
  $scope.goto_previous_day = function(){
    $scope.current_date -= 24*60*60*1000;
    get_health_info_by_date($scope.current_date);
  };
  $scope.goto_next_day = function(){
    $scope.current_date += 24*60*60*1000;
    get_health_info_by_date($scope.current_date);
  };
  
  function get_health_info_by_date(timestamp){
    var url = "http://127.0.0.1:8000/api/get_health_info";
    date = new Date(timestamp);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    
    var request_parameters = {
      user_id:123,
      start_datetime:Math.round(date.getTime()/1000),
      end_datetime:Math.round(date.getTime()/1000 + 24*60*60-1)
    };
  
    var options = {
      params: request_parameters
    };
  
    var request = $http.get(url, options);
    request.success(function(json_data){
      console.log(json_data);
      $scope.health_info = json_data;
      h=$scope.health_info;
      var color = ['indicator-grey', 'indicator-yellow', 'indicator-red', 'indicator-green', 'indicator-yellow', 'indicator-red'];
      var target = ['no', '<', '<<', 'within', '>', '>>'];
      if (h.max_heart_rate_status < 0){
        h.max_heart_rate_status += 6;
      }
      h.max_heart_rate_indicator = color[h.max_heart_rate_status];
      h.max_heart_rate_target = target[h.max_heart_rate_status];
      h.avg_heart_rate_indicator = color[h.avg_heart_rate_status]; 
      h.avg_heart_rate_target = target[h.avg_heart_rate_status]; 
      
      h.steps_indicator = color[h.steps_status];
      h.steps_target = target[h.steps_status];
      h.distance_indicator = color[h.distance_status];
      h.distance_target = target[h.distance_status];
      h.exercise_indicator = color[h.exercise_status];
      h.exercise_target = target[h.exercise_status];        
        //pie chart
      var chart = new CanvasJS.Chart("chartContainer",
	  {
		theme: "theme1",
		data: [
		{        
			type: "pie",      
			indexLabelFontSize: 16,
			startAngle:0,

			dataPoints: [
				{  y: $scope.health_info.low_intensity_time, name: "High"},
				{  y: $scope.health_info.high_intensity_time, name: "Low"},
			]
		}
		]
	  });
      chart.render();
    });
  }
  
  get_health_info_by_date($scope.current_date);

});


app.controller("activities-controller", function($scope,$http){
  $scope.current_date = Date.now();
  function get_activities_by_date(timestamp){
    var url = "http://50.174.197.248:89/api/get_activities";
  
    var request_parameters = {
      user_id:123,
      start_datetime:"2014-12-04 00:00:00",
      end_datetime:"2014-12-04 23:00:00"
    };
  
    var options = {
      params: request_parameters
    };
  
    var request = $http.get(url, options);
    request.success(function(json_data){
      //console.log(json_data);
      $scope.activities = json_data;
      var figure_image = ["wake_up", "fall_asleep", "walk", "run", "nap"];

      var background_image = [, "sunny","rain","cloudy"];
      var time_image = [,"morning","afternoon","evening","night"];
      for(var i=0; i<$scope.activities.length; ++i){
        activity = $scope.activities[i];
        activity.figure_image ='https://raw.githubusercontent.com/kikiliu/Linked/master/LinkedLiving/static/images/' + figure_image[activity.activity_type] + '.png';
        //console.log(activity.time_flag);
        if (activity.background_flag == -1 || activity.time_flag==-1){
          activity.background_image = '';
        }
        else{
          activity.background_image = 'https://raw.githubusercontent.com/kikiliu/Linked/master/LinkedLiving/static/images/' + background_image[activity.background_flag] + '_'+ time_image[activity.time_flag] + '.png';
        }
        if(activity.steps < 0 || activity.intensity < 0 || activity.avg_heart_rate <0 || activity.max_heart_rate<0){
          activity.info_display = false;
        }
        else{
          activity.info_display = true;
        }
        if(activity.activity_type == '0' || activity.activity_type == '1'){
          activity.period = false;
        }
        else{
          activity.period = true;
        }
      }
    });
  }
  get_activities_by_date($scope.current_date);
 });