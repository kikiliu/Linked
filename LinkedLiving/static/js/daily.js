function getDate(datetime) {
  return new Date(datetime.getFullYear(), datetime.getMonth(), datetime
          .getDate());
}

app.directive('healthGauge', function() {
  var monthString = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var dayString = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];
  function link(scope, element, attrs) {
    function update() {
      var dataTable = new google.visualization.DataTable();
      dataTable.addColumn('string', 'x-axis');
      dataTable.addColumn('number', "value");
      dataTable.addColumn({type: 'string', role: 'style'});
      dataTable.addColumn('number', "target");
      dataTable.addColumn('number', "target");
      dataTable.addColumn({type: 'string', role: 'style'});
      dataTable.addRow([monthString[scope.date.getMonth()]+" " +scope.date.getDate(), scope.value, 'opacity: 0.4;fill-opacity: 0.4;stroke-width:0', scope.target, scope.target, 'opacity:0']);
      dataTable.addRow(['Average on ' + dayString[scope.date.getDay()], scope.average, 'color:gray;fill-opacity:0.4;stroke-width:0', scope.target, scope.target, 'opacity:0']);
      var view = new google.visualization.DataView(dataTable);
      view.setColumns([0, 1,
                       { calc: "stringify",
                         sourceColumn: 1,
                         type: "string",
                         role: "annotation" },
                       2,3,4,5]);      
      draw(scope, view, element[0]);
    }
    scope.$watch('value', update);
  }

  function draw(scope, dataTable, element) {
    var options = {
      enableInteractivity: false,
      legend: {
        position: 'right'
      },
      bar: {
        groupWidth: "95%",
      },
      series: {
        1: {
          type: "steppedArea",
          color: scope.color,
          areaOpacity: '0',
          lineDashStyle: [2,2],
          visibleInLegend: false,
        },
        0: {
          type: "bars",
          color: scope.color,
          visibleInLegend: false,
        },
        2: {
          type: "line",
          color: scope.color,
          lineDashStyle: [2,2],
          labelInLegend: scope.legend,
          visibleInLegend: true,
        },
      },
      width: element.offsetWidth,
      height: element.offsetHeight,
      chartArea: {
        width: '50%',
      },
      hAxis: {
        maxTextLines: 4,
        allowContainerBoundaryTextCufoff: true,
        maxAlternation: 1,
      },
      vAxis: {
        format: '0',
        gridlines: {
          color: 'transparent'
        }
      },
/*      animation: {
        startup: true,
        duration: 200
      }*/
    };

    element.innerHTML = "";
    var chart = new google.visualization.ComboChart(element);
    chart.draw(dataTable, options);
  }

  return {
    restrict: 'E',// element, aka 'health-gauge'
    scope: {
      date: "=",
      value: "=",
      color: "=",
      legend: "=",
      average: "=",
      target: "=",
      targetName: "=",
    },
    link: link
  }
});

app.directive('dailyChart',
        function() {
          var heartRateColor = "#EF9aaa";
          var normalHeartRateColor = "#CF4858";
          var sleepColor = "#3E5D7E";
          var walkColor = "#16A79D";// green
          var runColor = "#F4AC02";// yellow

          function link(scope, element, attrs) {
            function update() {
              if (scope.heartRateData == null || scope.activityData == null)
                return;

              var dataTable = createDataTable(scope.date, scope.heartRateData,
                      scope.activityData);
              drawVisualization(element[0], dataTable, scope.definition);
            }

            function createDataTable(date, heartRateData, activityData) {
              var maxValue = 200;
              var minValue = 0;
              var dataTable = new google.visualization.DataTable();
              dataTable.addColumn('datetime', 'Date');
              dataTable.addColumn('number', "Heart Rate");
              dataTable.addColumn('number', "Average Heart Rate");
              dataTable.addColumn('number', 'sleep');
              dataTable.addColumn('number', 'sleep');
              dataTable.addColumn('number', 'walk');
              dataTable.addColumn('number', 'run');
              dataTable.addColumn('number', 'nap');

              for (var i = 0; i < heartRateData.length; i++) {
                var time = new Date(heartRateData[i].time_stamp * 1000);
                var row = [time, heartRateData[i].avg_hr, 150, null, null,
                    null, null, null];
                dataTable.addRow(row);
              }
              for (var i = 0; i < activityData.length; ++i) {
                var activity = activityData[i];
                var start = activity.start_activity_time == null
                        ? getDate(date).getTime()
                        : activity.start_activity_time * 1000;
                var end = activity.end_activity_time == null ? getDate(date)
                        .getTime()
                        + 24 * 60 * 60 * 1000
                        : activity.end_activity_time * 1000;
                var row1 = [new Date(start - 1), null, null, null, null, null,
                    null, null];
                var row2 = [new Date(start), null, null, null, null, null,
                    null, null];
                var row3 = [new Date(end), null, null, null, null, null, null,
                    null];
                var row4 = [new Date(end + 1), null, null, null, null, null,
                    null, null];
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

          function drawVisualization(element, dataTable) {
            var options = {
              enableInteractivity: false,
              legend: {
                position: 'right'
              },
              series: {
                0: {
                  type: "bars",
                  enableInteractivity: true,
                  color: normalHeartRateColor,
                  visibleInLegend: false
                },
                1: {
                  type: "line",
                  // lineDashStyle: [8,4],
                  color: heartRateColor,
                  labelInLegend: "Average maximum heart rate for people in 70s"
                },
                2: {
                  type: "area",
                  color: sleepColor,
                  areaOpacity: 0.3,
                  connectSteps: false,
                  lineWidth: 0,
                  visibleInLegend: false
                },
                3: {
                  type: "area",
                  color: sleepColor,
                  areaOpacity: 0.3,
                  connectSteps: false,
                  lineWidth: 0,
                  visibleInLegend: false
                },
                4: {
                  type: "area",
                  color: walkColor,
                  areaOpacity: 0.3,
                  connectSteps: false,
                  lineWidth: 0,
                  visibleInLegend: false
                },
                5: {
                  type: "area",
                  color: runColor,
                  areaOpacity: 0.3,
                  connectSteps: false,
                  lineWidth: 0,
                  visibleInLegend: false
                },
                6: {
                  type: "area",
                  color: sleepColor,
                  areaOpacity: 0.3,
                  connectSteps: false,
                  lineWidth: 0,
                  visibleInLegend: false
                }
              },
              width: element.offsetWidth,
              height: element.offsetHeight,
              /*
               * chartArea: { width: '940px', height: '300px' },
               */
              hAxis: {
                format: "h aa",
                gridlines: {
                  color: 'transparent'
                }
              },
              vAxis: {
                format: '0',
                title: "Heart Rate (beats/min)",
                titleTextStyle: {
                  fontName: 'Cabin',
                  fontSize: 14,
                  color: '#43s2F21',
                  italic: false
                }
              },
              annotations: {
                textStyle: {
                  fontName: 'Cabin',
                  fontSize: 14,
                  color: '#43s2F21'
                }
              },
              dataOpacity: 1,
              fontSize: 12,
              fontName: 'Cabin',
              animation: {
                startup: true,
                duration: 200
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
            // definition: "="
            },
            link: link
          }
        });

app
        .controller(
                "daily-info-controller",
                function($scope, $http) {
                  var red = "#CF4858";
                  
                  today = new Date();// 2015, 4, 1, 0, 0 -> May 1, 2015
                  $scope.date = new Date(today.getFullYear(),today.getMonth(), today.getDate(), 0, 0);
                  $scope.gotoPreviousDay = function() {
                    $scope.date = new Date($scope.date.getTime() - 24 * 60 * 60
                            * 1000);
                  }

                  $scope.gotoNextDay = function() {
                    $scope.date = new Date($scope.date.getTime() + 24 * 60 * 60
                            * 1000);
                  }

                  function getHeartRateData() {
                    var url = "./api/get_daily";

                    var request_parameters = {
                      user_id: 123,
                      start_datetime: Math.round($scope.date.getTime() / 1000),
                      end_datetime: Math.round($scope.date.getTime() / 1000
                              + 24 * 60 * 60 - 1)
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
                    getHealthInfo();
                  })

                  function getActivityData() {
                    var url = "api/get_activity/";
                    var request_parameters = {
                      user_id: 123,
                      start_datetime: Math.round($scope.date.getTime() / 1000),
                      end_datetime: Math.round($scope.date.getTime() / 1000
                              + 24 * 60 * 60 - 1)
                    };

                    var options = {
                      params: request_parameters
                    };

                    var request = $http.get(url, options);

                    var background = [
                        [, , , , ],
                        [, "sunny_morning", "sunny_afternoon", "sunny_evening",
                            "sunny_night"],
                        [, "rain_morning", "rain_afternoon", "rain_evening",
                            "rain_night"],
                        [, "cloudy_morning", "cloudy_afternoon",
                            "cloudy_evening", "cloudy_night"],
                        [, "snow_morning", "snow_afternoon", "snow_evening",
                            "snow_night"]];
                    var figure = ["wake_up", "wake_up", "walk", "run", "nap"];

                    request
                            .success(function(json_data) {
                              var activities = json_data["table"];
                              for (var i = 0; i < activities.length; ++i) {
                                var activity = activities[i];
                                if (activity.background_flag > 0
                                        && activity.time_flag > 0) {
                                  activity.background = "./static/images/"
                                          + background[activity.background_flag][activity.time_flag]
                                          + ".png"
                                }
                                activity.figure = "./static/images/"
                                        + figure[activity.activity_type]
                                        + ".png";

                              }
                              $scope.activityData = json_data["table"];
                            });
                  }

                  function getHealthInfo() {
                    var url = "api/get_health_info/";
                    var request_parameters = {
                      user_id: 123,
                      start_datetime: Math.round($scope.date.getTime() / 1000),
                      end_datetime: Math.round($scope.date.getTime() / 1000
                              + 24 * 60 * 60 - 1)
                    };

                    var options = {
                      params: request_parameters
                    };

                    var request = $http.get(url, options);

                    request.success(function(json_data) {
                      $scope.healthInfo = json_data;
                    });
                  }

                  $scope.comments = [{
                    user: "Sarah",
                    profile: "sarah.png",
                    date: "4/1/2015",
                    content: "'Mom, I am glad that you took a walk that afternoon in good weather.'"
                  }];

                  $scope.cancelComment = function() {
                    $scope.inputBox = false;
                    $scope.commentContent = "";
                  }
                  $scope.submitNewComment = function() {
                    var now = new Date();
                    var newComment = {
                      user: "Maggy",
                      profile: "maggy.png",
                      date: now,
                      content: $scope.commentContent
                    };
                    $scope.comments.splice(0, 0, newComment);
                    $scope.cancelComment();
                  }

                  $scope.notes = [];
                  $scope.cancelNote = function() {
                    $scope.noteBox = false;
                    $scope.noteContent = "";
                  }
                  $scope.submitNewNote = function() {
                    var now = new Date();
                    var newNote = {
                      date: now,
                      content: $scope.noteContent
                    };
                    $scope.notes.splice(0, 0, newNote);
                    $scope.cancelNote();
                  }
                });