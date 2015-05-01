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
  
  function get_hr_data_by_range() {
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
      $scope.data = json_data["table"];
    });
  }
  
  $scope.$watch('date', function(value) { get_hr_data_by_range(); })
  
  function get_activity_data_by_range(start, end) {
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
      $scope.activitydata = json_data["table"];
    });
  }
  
});
/*
function createDailyDataTable(data, series) {
  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn('datetime', 'Time');
  dataTable.addColumn('number', 'Heat Rate');
  dataTable.addColumn('number', 'Heart Rate Line');
  dataTable.addColumn('type', 'Activity Type')

  for (var i = 0; i < data.length; i++) {
    var date = new Date(data[i].time_stamp);
    var time = date.getHours() +":" + date.getMinutes();
    dataTable.addRow(time);
    
  }
  return dataTable;
}


function drawDailyVisualization(element, dataTable, lineColor, vFormat) {
  var options = {
    seriesType: "bars",
    series: {
      0: {
        color: #CF4858,
        visibleInLegend: false
      },
      1: {
        type: "line",
        color: #CF4858
      }
    },
    width: 580,
    chartArea: {
      left: 40,
      width: '75%',
      height: '70%'
    },
    hAxis: {
      format: 'MMM\ndd'
    },
    vAxis: {
      format: vFormat
    },
    annotations: {
      textStyle: {
        fontName: 'Cabin',
        fontSize: 14,
        color: '#43s2F21'
      }
    },
    dataOpacity: 0.3,
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
}*/