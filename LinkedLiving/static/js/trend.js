app.controller("trend-data-controller", function($scope, $http) {
  $scope.isOptionsExpanded = true;

  $scope.dateRange = "last30days";
  var red = "#CF4858";
  var green = "#16A79D";
  var purple = "#80628B";

  var hrIcon = "/static/images/heart.gif";
  var actIcon = "/static/images/run.gif";
  var mobIcon = "/static/images/mobility.gif";

  $scope.showDays = function(timedelta) {
    if (timedelta == null) {
      get_trend_data_by_range(null, null);
    } else {
      var now = new Date();
      var start = new Date(now.getTime() - timedelta * 24 * 60 * 60 * 1000);
      var end = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      get_trend_data_by_range(start, end);
    }
  };

  $scope.showCustomizedDateRange = function() {
    get_trend_data_by_range($scope.startDate, $scope.endDate);
  }
  /*
   * Separate all data about charts from functions
   */
  $scope.definitions = [{
    id: 'AverageHeartRateDuringSleep',
    label: 'Average HR during sleep',
    type: 'hr',
    series: [{
      label: 'HR',
      field: 'avg_hr_sleep'
    }, {
      label: 'Trendline',
      field: 'avg_hr_sleep_baseline'
    }],
    lineColor: red,
    hFormat: 'MMM\ndd',
    vFormat: "0",
    toggle: true,
    icon: hrIcon,
    unit: " (beats per minute)",
    opacity: 0.3
  }, {
    id: 'AverageHeartRateAtRest',
    label: 'Average HR at rest',
    type: 'hr',
    series: [{
      label: 'HR',
      field: 'avg_hr_rest'
    }, {
      label: 'Trendline',
      field: 'avg_hr_rest_baseline'
    }],
    lineColor: red,
    hFormat: 'MMM\ndd',
    vFormat: "0",
    toggle: false,
    icon: hrIcon,
    unit: " (beats per minute)",
    opacity: 0.3
  }, {
    id: 'DailyMaximumHeartRate',
    label: 'Daily maximum HR',
    type: 'hr',
    series: [{
      label: 'HR',
      field: 'max_hr'
    }, {
      label: 'Trendline',
      field: 'max_hr_baseline'
    }],
    lineColor: red,
    hFormat: 'MMM\ndd',
    vFormat: "0",
    toggle: false,
    icon: hrIcon,
    unit: " (beats per minute)",
    opacity: 0.3
  }, {
    id: 'PercentOfTimeAboveHigh',
    label: 'Time with HR above 180',
    type: 'hr',
    series: [{
      label: 'Percentage',
      field: 'percent_of_time_above_high'
    }, {
      label: 'Trendline',
      field: 'percent_of_time_above_high_baseline'
    }],
    lineColor: red,
    hFormat: 'MMM\ndd',
    vFormat: "0.0",
    toggle: false,
    icon: hrIcon,
    unit: " (percentage of the day)",
    opacity: 0.3
  }, {
    id: 'PercentOfTimeAboveLow',
    label: 'Time with HR above 100',
    type: 'hr',
    series: [{
      label: 'Percentage',
      field: 'percent_of_time_above_low'
    }, {
      label: 'Trendline',
      field: 'percent_of_time_above_low_baseline'
    }],
    lineColor: red,
    hFormat: 'MMM\ndd',
    vFormat: "0.0",
    toggle: false,
    icon: hrIcon,
    unit: " (percentage of the day)",
    opacity: 0.3
  }, {
    id: 'ExerciseDuration',
    label: 'Minutes of exercise',
    type: 'activity',
    series: [{
      label: 'Minutes',
      field: 'exercise_duration_minutes'
    }, {
      label: 'Target',
      field: 'exercise_duration_minutes_baseline'
    }],
    lineColor: green,
    hFormat: 'MMM\ndd',
    vFormat: "0",
    toggle: true,
    icon: actIcon,
    unit: " (minutes)",
    opacity: 0.3
  }, {
    id: 'SleepDuration',
    label: 'Hours of sleep',
    type: 'activity',
    series: [{
      label: 'Hours',
      field: 'sleep_duration_hours'
    }, {
      label: 'Target',
      field: 'sleep_duration_hours_baseline'
    }],
    lineColor: green,
    hFormat: 'MMM\ndd',
    vFormat: "0",
    toggle: false,
    icon: actIcon,
    unit: " (hours)",
    opacity: 0.3
  }, {
    id: 'IntenseExerciseDuration',
    label: 'Minutes of intense exercise',
    type: 'activity',
    series: [{
      label: 'Minutes',
      field: 'intense_exercise_duration_minutes'
    }, {
      label: 'Target',
      field: 'intense_exercise_duration_minutes_baseline'
    }],
    lineColor: green,
    hFormat: 'MMM\ndd',
    vFormat: "0",
    toggle: false,
    icon: actIcon,
    unit: " (minutes)",
    opacity: 0.3
  }, {
    id: 'TotalSteps',
    label: 'Number of steps',
    type: 'mobility',
    series: [{
      label: 'Steps',
      field: 'total_steps'
    }, {
      label: 'Target',
      field: 'total_steps_baseline'
    }],
    lineColor: purple,
    hFormat: 'MMM\ndd',
    vFormat: "0",
    toggle: false,
    icon: mobIcon,
    unit: " (steps)",
    opacity: 0.3
  }];
  // index for sorting
  angular.forEach($scope.definitions, function(definition) {
    definition.toggleTimestamp = 0;
  });
  $scope.toggle = function(definition) {
    definition.toggleTimestamp = new Date().getTime();
  };

  $scope.isType = function(type) {
    return function(definition) {
      return definition.type == type;
    };
  };

  $scope.isToggled = function() {
    return function(definition) {
      return definition.toggle;
    };
  };

  function get_trend_data_by_range(start, end) {
    $scope.startDate = start;
    $scope.endDate = end;

    var url = "/api/get_trend";

    var request_parameters = {
      user_id: 123,
      start_datetime: (start == null ? null : Math
              .round(start.getTime() / 1000)),
      end_datetime: (end == null ? null : Math.round(end.getTime() / 1000))
    };

    var options = {
      params: request_parameters
    };

    var request = $http.get(url, options);
    request.success(function(json_data) {
      $scope.data = json_data["table"];
    });
  }

  $scope.showDays(30);// to be changed to desired days
});

