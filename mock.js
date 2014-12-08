function rand(min, max) {
	return Math.floor(Math.random() * (max + 1 - min) + min);
}

function getTime(hours, minutes) {
	var time = new Date();
	time.setHours(hours);
	time.setMinutes(minutes);
	return time.getTime();
}

var express = require('express')
var app = express()

app.get('/api/get_health_info', function (req, res) {
  res.json({
  	max_heart_rate: rand(80,120),
  	max_heart_rate_status: rand(0,2),
  	avg_heart_rate: rand(60,80),
	avg_heart_rate_status: rand(-2, 2),
	steps: rand(1000, 3000),
	steps_status: rand(-2, 0),
	distance: rand(100, 800),
	distance_status: rand(-2, 0),
	exercise_time: rand(10,90),
	exercise_status: rand(-2, 0),
	high_intensity_time: rand(0, 60),
	low_intensity_time: rand(20, 120),
	last_update: Date.now(),
  });
});

app.get('/api/get_user_info', function(req, res) {
	res.json({
		name: "Nefario",
      	image: "http://statici.behindthevoiceactors.com/behindthevoiceactors/_img/chars/char_26725.jpg",
		local_time: Date.now(),
		location: "Berkeley, CA",
      	relatives:[
            {
				name: "George",
             	img: "http://pmcdeadline2.files.wordpress.com/2013/02/minion__130211164715.jpg",
				local_time: Date.now()
			},
			{
				name: "Sarah",
            	img: "http://www.zastavki.com/pictures/originals/2013/Cartoons_Minions_little_girl_051610_.jpg",
				local_time: Date.now()
			}
		]
	});
});

app.get('/api/get_activities', function(req, res) {
	res.json([
		{
			activity_type: 0,
			start_activity_time: getTime(7,0),
			caption: "Nefario woke up. He seemed to have a good sleep",
			max_heart_rate: rand(70,90),
		},
		{
			activity_type: 2,
			start_activity_time: getTime(8,0),
			end_activity_time: getTime(9,20),
			caption: "Nefario had a walk.",
			max_heart_rate: rand(80,110),
		},
		{
			activity_type: 4,
			start_activity_time: getTime(13,14),
			end_activity_time: getTime(14,53),
			caption: "Nefario took a nap.",
			max_heart_rate: rand(70,80),
		},
		{
			activity_type: 1,
			start_activity_time: getTime(21,46),
			caption: "Nefario went to sleep.",
			max_heart_rate: rand(60,90),
		}
	]);
});

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})