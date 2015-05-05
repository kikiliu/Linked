app.directive('heartRateChart', function() {
  var heartRateColor = "#EF9aaa";
  var normalHeartRateColor = "#CF4858";
  var sleepColor = "#3E5D7E";//email
  var walkColor = "#F4AC02";//yellow
  var runColor = "#16A79D";//green

  function link(scope, element, attrs) {
    function update() {
      if (scope.heartRateData == null || scope.activityData == null)
        return;

      var dataTable = createDataTable(scope.date, scope.heartRateData, scope.activityData);
      drawVisualization(element[0], dataTable, scope.definition);
    }
    
    function createDataTable(date, heartRateData, activityData) {
      var maxValue = 200;
      var minValue = 0;
      var dataTable = new google.visualization.DataTable();
      dataTable.addColumn('datetime', 'Date');
      dataTable.addColumn('number', "Heart Rate");
      dataTable.addColumn('number', "Average Heart Rate");
      dataTable.addColumn('number', 'a');
      dataTable.addColumn('number', 'a');
      dataTable.addColumn('number', 'a');
      
      for(var i=0;i<heartRateData.length;i++) {
        var time = new Date(heartRateData[i].time_stamp*1000);
        var row = [time, heartRateData[i].avg_hr, 120, null, null, null];
        dataTable.addRow(row);
      }
      for (var i = 0; i < activityData.length; ++i) {
        var activity = activityData[i];
        var row1 = [new Date(activity.start_activity_time*1000-1), null, null, null, null, null];
        var row2 = [new Date(activity.start_activity_time*1000), null, null, null, null, null];
        var row3 = [new Date(activity.end_activity_time*1000), null, null, null, null, null];
        var row4 = [new Date(activity.end_activity_time*1000+1), null, null, null, null, null];
        row1[3 + activityData[i].activity_type] = minValue;
        row2[3 + activityData[i].activity_type] = maxValue;
        row3[3 + activityData[i].activity_type] = maxValue;
        row4[3 + activityData[i].activity_type] = minValue;
        dataTable.addRow(row1);
        dataTable.addRow(row2);
        dataTable.addRow(row3);
        dataTable.addRow(row4);
      }
      
      return dataTable;
    }
    
    scope.$watch('heartRateData', update);
    scope.$watch('activityData', update);
  }
  
  function drawVisualization(element, dataTable, definition) {
    var options = {
      enableInteractivity: false,      
      legend: {position: 'none'},
      series: {
        0: {
          type: "bars",
          enableInteractivity: true,
          color: heartRateColor,
          visibleInLegend: false
        },
        1: {
          type: "line",
          lineDashStyle: [8,4],
          color: normalHeartRateColor,
        },
        2: {
          type: "area",
          color: sleepColor,
          areaOpacity: 0.3,
          connectSteps: false,
          lineWidth: 0
        },
        3: {
          type: "area",
          color: walkColor,
          areaOpacity: 0.3,
          connectSteps: false,
          lineWidth: 0
        },
        4: {
          type: "area",
          color: runColor,
          areaOpacity: 0.3,
          connectSteps: false,
          lineWidth: 0
        }
      },
      width: element.offsetWidth,
      height: element.offsetHeight,
      chartArea: {
        width: '670px',
        height: '300px'
      },
      hAxis: {
        format: "h aa",
        gridlines: { color: 'transparent' } 
      },
      vAxis: {
        format: definition.vFormat
      },
      annotations: {
        textStyle: {
          fontName: 'Cabin',
          fontSize: 14,
          color: '#43s2F21'
        }
      },
      dataOpacity: definition.opacity,
      fontSize: 12,
      fontName: 'Cabin',
      animation: {
        startup: true,
        duration: 500
      }
    };
    element.innerHTML = "";
    var chart = new google.visualization.ComboChart(element);
    chart.draw(dataTable, options);
  }  

  return {
    restrict: 'A',// attribute, aka 'chart'
    scope: {
      date: "=",
      heartRateData: "=",
      activityData: "=",
      definition: "="
    },
    link: link
  }
});

app.controller("daily-info-controller", function($scope, $http) {
  var red = "#CF4858";
  $scope.date = new Date(2015,3,1,0,0,0);
  $scope.definition = {
          id: 'HeartRate',
          series: [{
            label: 'HR',
            field: 'avg_hr'
          }],
          lineColor: red,
          hFormat: 'hh:mm',
          vFormat: "0",
        };
  
  $scope.gotoPreviousDay = function() {
    $scope.date = new Date($scope.date.getTime() - 24*60*60*1000);
  }

  $scope.gotoNextDay = function() {
    $scope.date = new Date($scope.date.getTime() + 24*60*60*1000);
  }
  
  function getHeartRateData() {
    var url = "/api/get_daily";

    var request_parameters = {
      user_id: 123,
      start_datetime:Math.round($scope.date.getTime()/1000),
      end_datetime:Math.round($scope.date.getTime()/1000 + 24*60*60-1)
    };

    var options = {
      params: request_parameters
    };

    var request = $http.get(url, options);
    request.success(function(json_data) {
      $scope.heartRateData = json_data["table"];
    });
  }
  
  $scope.$watch('date', function(value) {
    $scope.heartRateData = null;
    $scope.activityData = null;
    getHeartRateData();
    getActivityData();
  })
  
  function getActivityData() {
    var url = "api/get_activity/";
    var request_parameters = {
      user_id: 123,
      start_datetime:Math.round($scope.date.getTime()/1000),
      end_datetime:Math.round($scope.date.getTime()/1000 + 24*60*60-1)
    };

    var options = {
      params: request_parameters
    };

    var request = $http.get(url, options);
    request.success(function(json_data) {
      $scope.activityData = json_data["table"];
    });
  }
  
});