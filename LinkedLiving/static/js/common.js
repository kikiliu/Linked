var app = angular.module("LinkedLiving", ['ui.bootstrap.datetimepicker']);
app.directive('chart', function() {
  function link(scope, element, attrs) {

    function update() {
      if (scope.data == null) return;
      var dataTable = createDataTable(scope.data, scope.definition);
      drawVisualization(element[0], dataTable, scope.definition);
    }
    scope.$watch('data', update);
  }

  return {
    restrict: 'A',// attribute, aka 'chart'
    scope: {
      data: "=data",
      definition: "=definition"
    },
    link: link
  }
});

/*
 * series = [{label: 'HR', field: 'avg_hr_rest'}, {}, ...]
 */
function createDataTable(data, definition) {
  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn('datetime', 'Date');
  for (var i = 0; i < definition.series.length; ++i) {
    dataTable.addColumn('number', definition.series[i].label);
  }
  for (var i = 0; i < data.length; i++) {
    var date = new Date(data[i].time_stamp * 1000);

    var row = [date];
    for (var j = 0; j < definition.series.length; ++j) {
      row.push(data[i][definition.series[j].field]);
    }
    dataTable.addRow(row);
  }
  return dataTable;
}

function drawVisualization(element, dataTable, definition) {
  var options = {
    seriesType: "bars",
    series: {
      0: {
        color: definition.lineColor,
        visibleInLegend: false
      },
      1: {
        type: "line",
        color: definition.lineColor
      }
    },
    width: element.offsetWidth,
    height: element.offsetHeight,
    chartArea: {
      left: 40,
      width: '75%',
      height: '70%'
    },
    hAxis: {
      format: definition.hFormat
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


