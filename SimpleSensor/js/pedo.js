
(function() {
    var light = null,
    magnetic = null,
    pressure = null,
    uv = null,
    fileName = null,
    
    datetimeData = {},
    dataEntry = {};
    
    
    
    //resolve a directory
    
    init();

    
    

        
    /**
     * DateTime function
     */
     
     function getDatetimeData(){
    	 var date = tizen.time.getCurrentDateTime(),

    	 dtData = {
    			 date: date.getDate(),	 
    			 month: date.getMonth()+1, //getMonth return 0-11, transform to real month by adding 1
    			 year: date.getFullYear(),			 
            	 hours: date.getHours(),
            	 minutes: date.getMinutes(),
            	 seconds: date.getSeconds(),
            	 milliseconds: date.getMilliseconds()
    	 };
    	
    	 return dtData;
     }
     
     function updateDateTimeBattery(){
    	 function onSuccessCallback(battery){
    		 document.getElementById("battery").innerHTML = 'Battery Level : ' + Math.round(battery.level*100) + '%';
    		 dataEntry["battery_level"] = Math.round(battery.level*100);
    	 }
    	 
    	 function onErrorCallback(error){
    		 console.log("An error occurred "+ error.message);
    	 }
         tizen.systeminfo.getPropertyValue("BATTERY",onSuccessCallback,onErrorCallback);
         
         datetimeData = getDatetimeData();
         
         document.getElementById("date").innerHTML = 'Date : ' + datetimeData.year + '/' + datetimeData.month + '/' + datetimeData.date;
         dataEntry["date_year"] = datetimeData.year;
         dataEntry["date_month"] = datetimeData.month;
         dataEntry["date_day"] = datetimeData.date;
         
         document.getElementById("time").innerHTML = 'Time : ' + datetimeData.hours + ':' + datetimeData.minutes + ':' + datetimeData.seconds;
         dataEntry["time_hour"] = datetimeData.hours;
         dataEntry["time_minute"] = datetimeData.minutes;
         dataEntry["time_second"] = datetimeData.seconds;
         
     }
     
     /**
      * Pressure Sensor functions
      */

     function startPressure(){	    	    
    	 pressure = webapis.sensorservice.getDefaultSensor("PRESSURE");
    	 
    	 function onchangedCB(sensorData) {
             //console.log("pressure level : " + sensorData.pressure);
             document.getElementById("pressure-pressure").innerHTML = 'Pressure Level : ' + sensorData.pressure; 
             dataEntry["pressure_level"] = sensorData.pressure; 
         } 

    	 function onerrorCB(error) {
             console.log("error occurs when pressure sensor start");
    	 } 

    	 function onsuccessCB() {
             console.log("pressure sensor start");
    	 }
    	 pressure.setChangeListener(onchangedCB);
    	 pressure.start(onsuccessCB, onerrorCB);
    	 
      }
     
      function stopPressure(){
          console.log("pressure sensor stopped");
    	  pressure.stop();
      }     

      function resetPressure(){
          document.getElementById("pressure-pressure").innerHTML = 'Pressure Level'; 
          dataEntry["pressure_level"] = null; 
      }
      /**
       * UV Sensor functions
       */

      function startUV(){	    	    
     	 uv = webapis.sensorservice.getDefaultSensor("ULTRAVIOLET");
     	 
     	 function onchangedCB(sensorData) {
              //console.log("uv level : " + sensorData.ultravioletLevel);
              document.getElementById("uv-uvlevel").innerHTML = 'UV Level : ' + sensorData.ultravioletLevel; 
              dataEntry["uv_level"] = sensorData.ultravioletLevel;
          } 

     	 function onerrorCB(error) {
              console.log("error occurs when uv sensor start");
     	 } 

     	 function onsuccessCB() {
              console.log("uv sensor start");
     	 }
     	 uv.setChangeListener(onchangedCB);
     	 uv.start(onsuccessCB, onerrorCB);
     	 
       }
      
       function stopUV(){
          console.log("uv sensor stopped");
     	  uv.stop();
       }          

       function resetUV(){
           document.getElementById("uv-uvlevel").innerHTML = 'UV Level';
           dataEntry["uv_level"] =null;
       }

     /**
      * Magnetic Sensor functions
      */

     function startMagnetic(){	    	    
    	 magnetic = webapis.sensorservice.getDefaultSensor("MAGNETIC");
    	 
    	 function onchangedCB(sensorData) {
             //console.log("magnetic x : " + sensorData.x);
             //console.log("magnetic y : " + sensorData.y);
             //console.log("magnetic z : " + sensorData.z);
             //console.log("magnetic accuracy : " + sensorData.accuracy);
             document.getElementById("magnetic-x").innerHTML = 'Magnetic X : ' + sensorData.x;
             dataEntry["magnetic_x"] = sensorData.x;
             document.getElementById("magnetic-y").innerHTML = 'Magnetic Y : ' + sensorData.y;
             dataEntry["magnetic_y"] = sensorData.y;
             document.getElementById("magnetic-z").innerHTML = 'Magnetic Z : ' + sensorData.z; 
             dataEntry["magnetic_z"] = sensorData.z;
             document.getElementById("magnetic-accuracy").innerHTML = 'Accuracy : ' + sensorData.accuracy; 
             dataEntry["magnetic_accuracy"] = sensorData.accuracy;
    	 } 

    	 function onerrorCB(error) {
             console.log("error occurs when magnetic sensor start");
    	 } 

    	 function onsuccessCB() {
             console.log("Magnetic sensor start");
    	 }
    	 magnetic.setChangeListener(onchangedCB);
    	 magnetic.start(onsuccessCB, onerrorCB);
    	 
      }
     
      function stopMagnetic(){
          console.log("Magnetic sensor stopped");
    	  magnetic.stop();
      }     
     
      function resetMagnetic(){
          document.getElementById("magnetic-x").innerHTML = 'Magnetic X'; 
          dataEntry["magnetic_x"] = null;
          document.getElementById("magnetic-y").innerHTML = 'Magnetic Y'; 
          dataEntry["magnetic_y"] = null;
          document.getElementById("magnetic-z").innerHTML = 'Magnetic Z'; 
          dataEntry["magnetic_z"] = null;
          document.getElementById("magnetic-accuracy").innerHTML = 'Accuracy';  
          dataEntry["magnetic_accuracy"] = null;
      }
     
     /**
      * Light Sensor functions
      */

     function startLight(){	    	    
    	 light = webapis.sensorservice.getDefaultSensor("LIGHT");
    	 
    	 function onchangedCB(sensorData) {
             //console.log("light level : " + sensorData.lightLevel);
             document.getElementById("light-lightlevel").innerHTML = 'Light Level : ' + sensorData.lightLevel; 
             dataEntry["light_level"] = sensorData.lightLevel;
         } 

    	 function onerrorCB(error) {
             console.log("error occurs when light sensor start");
    	 } 

    	 function onsuccessCB() {
             console.log("light sensor start");
    	 }
    	 light.setChangeListener(onchangedCB);
    	 light.start(onsuccessCB, onerrorCB);
    	 
      }
     
      function stopLight(){
          console.log("light sensor stopped");
    	  light.stop();
      }

      function resetLight(){
    	  document.getElementById("light-lightlevel").innerHTML = 'Light Level'; 
    	  dataEntry["light_level"] = null;
      }       
      
      
    /**
     * GPS functions
     */

      function startGPS(){	
    	  function onchangedCB(gpsInfo){
	    	  if (navigator.geolocation)
	    	  {
		    	    navigator.geolocation.getCurrentPosition(function(position)
		    	    {
		    	    	//console.log('Longitude : ' + position.coords.longitude);
		    	    	//console.log('Latitude : ' + position.coords.latitude);
		    	    	//console.log('Altitude : ' + position.coords.altitude);
		    	    	//console.log('Accuracy : ' + position.coords.accuracy);
		    	    	 document.getElementById("gps-longitude").innerHTML = 'Longitude : ' + position.coords.longitude;
		    	    	 dataEntry["gps_longitude"] = position.coords.longitude;
		    	    	 document.getElementById("gps-latitude").innerHTML = 'Latitude : ' + position.coords.latitude;  
		    	    	 dataEntry["gps_latitude"] = position.coords.latitude;
		    	    	 document.getElementById("gps-altitude").innerHTML = 'Altitude : ' + position.coords.altitude;
		    	    	 dataEntry["gps_altitude"] = position.coords.altitude;
		    	    	 document.getElementById("gps-accuracy").innerHTML = 'Accuracy : ' + position.coords.accuracy;
		    	    	 dataEntry["gps_accuracy"] = position.coords.accuracy;
		    	    });
	    	  }
    	  }
     	 webapis.motion.start("GPS",onchangedCB);
      }
      
      function stopGPS(){
         console.log("GPS stopped");
     	 webapis.motion.stop('GPS');
      }      
      function resetGPS(){
	    	 document.getElementById("gps-longitude").innerHTML = 'Longitude';  
	    	 dataEntry["gps_longitude"] = null;
	    	 document.getElementById("gps-latitude").innerHTML = 'Latitude'; 
	    	 dataEntry["gps_latitude"] = null;
	    	 document.getElementById("gps-altitude").innerHTML = 'Altitude';
	    	 dataEntry["gps_altitude"] = null;
	    	 document.getElementById("gps-accuracy").innerHTML = 'Accuracy';
	    	 dataEntry["gps_accuracy"] = null;
      }       

    /**
     * Heart Rate Monitor functions
     */
     function startHRM(){	 
         function onchangedCB(hrmInfo) {             
             //console.log('heart rate : ' + hrmInfo.heartRate);
             document.getElementById("hrm-heartrate").innerHTML = 'Heart Rate : ' + hrmInfo.heartRate; 
             dataEntry["hrm_rate"] = hrmInfo.heartRate; 
         }
    	 webapis.motion.start("HRM",onchangedCB);

     }
     function stopHRM(){
         console.log("Heart rate monitor stopped");
    	 webapis.motion.stop('HRM');
     }          
     function resetHRM(){
    	 document.getElementById("hrm-heartrate").innerHTML = 'Heart Rate'; 
    	 dataEntry["hrm_rate"] = null; 
     }      
     /**
      * Pedometer functions
      */
     function startPedometer(){	 
         function onchangedCB(pedometerInfo) {
             
             //console.log('Total Steps : ' + pedometerInfo.totalStep);
             document.getElementById("pedo-calories").innerHTML = 'Calories Burnt : ' + pedometerInfo.cumulativeCalorie; 
             dataEntry["pedo_calorie"] = pedometerInfo.cumulativeCalorie;
             document.getElementById("pedo-steps").innerHTML =  'Total Steps : ' + pedometerInfo.cumulativeTotalStepCount;
             dataEntry["pedo_total"] = pedometerInfo.cumulativeTotalStepCount;
             document.getElementById("pedo-walksteps").innerHTML = 'Walk Steps : ' + pedometerInfo.cumulativeWalkStepCount; 
             dataEntry["pedo_walk"] =  pedometerInfo.cumulativeWalkStepCount; 
             document.getElementById("pedo-runsteps").innerHTML = 'Run Steps : ' + pedometerInfo.cumulativeRunStepCount;
             dataEntry["pedo_run"] =  pedometerInfo.cumulativeRunStepCount;
             document.getElementById("pedo-distance").innerHTML = 'Distance : ' + pedometerInfo.cumulativeDistance;
             dataEntry["pedo_distance"] = pedometerInfo.cumulativeDistance;
             document.getElementById("pedo-speed").innerHTML = 'Speed : ' + pedometerInfo.speed;
             dataEntry["pedo_speed"] = pedometerInfo.speed;
             document.getElementById("pedo-stepstatus").innerHTML = 'Step Status : ' + pedometerInfo.stepStatus;
             dataEntry["pedo_status"] = pedometerInfo.stepStatus;
             
         }
    	 webapis.motion.start("PEDOMETER",onchangedCB);
     }
     
     function stopPedometer(){
         console.log("pedometer stopped");
    	 webapis.motion.stop('PEDOMETER');
     }     
     
     function resetPedometer(){
         document.getElementById("pedo-calories").innerHTML = 'Calories Burnt';
         dataEntry["pedo_calorie"] = null;
         document.getElementById("pedo-steps").innerHTML =  'Total Steps';
         dataEntry["pedo_total"] = null;
         document.getElementById("pedo-walksteps").innerHTML = 'Walk Steps';
         dataEntry["pedo_walk"] = null;
         document.getElementById("pedo-runsteps").innerHTML = 'Run Steps';
         dataEntry["pedo_run"] = null;
         document.getElementById("pedo-distance").innerHTML = 'Distance';
         dataEntry["pedo_distance"] = null;
         document.getElementById("pedo-speed").innerHTML = 'Speed';
         dataEntry["pedo_speed"] = null;
         document.getElementById("pedo-stepstatus").innerHTML = 'Step Status';
         dataEntry["pedo_status"] = null;
     }
  
     /**
      * Enable btn control and add listener
      */

     
     
     function onIndoorBtnClick(){
    	 console.log("Indoor Button Clicked");
    	 
    	 document.getElementById('walking-btn').style.visibility='visible';  
    	 document.getElementById('running-btn').style.visibility='visible';  
    	 document.getElementById('stopAct-btn').style.visibility='visible';  
    	 document.getElementById('sleep-btn').style.visibility='visible'; 
    	 document.getElementById('yoga-btn').style.visibility='visible'; 
    	 document.getElementById('cycling-btn').style.visibility='visible'; 
    	 document.getElementById('weight-training-btn').style.visibility='visible'; 
    	 document.getElementById('gym-exercise-btn').style.visibility='visible';     	 
    	 
    	 document.getElementById("mode").innerHTML = "Mode: Indoor";
    	 dataEntry["mode_record"] = "Indoor";
     }
     
     function onOutdoorBtnClick(){
    	 console.log("Outdoor Button Clicked");

    	 document.getElementById('walking-btn').style.visibility='visible';  
    	 document.getElementById('running-btn').style.visibility='visible';  
    	 document.getElementById('stopAct-btn').style.visibility='visible'; 
    	 document.getElementById('sleep-btn').style.visibility='visible'; 
    	 document.getElementById('yoga-btn').style.visibility='visible'; 
    	 document.getElementById('cycling-btn').style.visibility='visible'; 
    	 document.getElementById('weight-training-btn').style.visibility='visible'; 
    	 document.getElementById('gym-exercise-btn').style.visibility='visible'; 
    	 
    	 
    	 
    	 document.getElementById("mode").innerHTML = "Mode: Outdoor";
    	 dataEntry["mode_record"] = "Outdoor";
     }

     
     function resetActBtnColor(){
    	 document.getElementById('walking-btn').style.backgroundColor ='lightgreen';  
    	 document.getElementById('running-btn').style.backgroundColor ='lightgreen';  
    	 document.getElementById('stopAct-btn').style.backgroundColor ='lightgreen'; 
    	 document.getElementById('sleep-btn').style.backgroundColor ='lightgreen'; 
    	 document.getElementById('yoga-btn').style.backgroundColor ='lightgreen'; 
    	 document.getElementById('cycling-btn').style.backgroundColor ='lightgreen'; 
    	 document.getElementById('weight-training-btn').style.backgroundColor ='lightgreen'; 
    	 document.getElementById('gym-exercise-btn').style.backgroundColor ='lightgreen'; 
     }
     
     function onWalkingBtnClick(){
    	 console.log("Walking Button Clicked");
    	 
    	 document.getElementById("act_label").innerHTML = "Activity: Walking";
    	 
    	 dataEntry["activity_label"] = "Walking";
    	 resetActBtnColor();
    	 document.getElementById('walking-btn').style.backgroundColor ='red';
     }

     function onRunningBtnClick(){
    	 console.log("Running Button Clicked");
    	 
    	 document.getElementById("act_label").innerHTML = "Activity: Running";
    	 dataEntry["activity_label"] = "Running";
    	 resetActBtnColor();
    	 document.getElementById('running-btn').style.backgroundColor ='red';    	 
     }     

     function onStopActBtnClick(){
    	 console.log("Stop Act Button Clicked");
    	 
    	 document.getElementById("act_label").innerHTML = "Activity: Stop";
    	 dataEntry["activity_label"] = "Stop";
    	 resetActBtnColor();
    	 document.getElementById('stopAct-btn').style.backgroundColor ='red';      	 
     }       
     
     function onSleepBtnClick(){
    	 console.log("Sleep Button Clicked");
    	 
    	 document.getElementById("act_label").innerHTML = "Activity: Sleep";
    	 dataEntry["activity_label"] = "Sleep"; 
    	 resetActBtnColor();
    	 document.getElementById('sleep-btn').style.backgroundColor ='red';  
     }     
     
     function onYogaBtnClick(){
    	 console.log("Yoga Button Clicked");
    	 
    	 document.getElementById("act_label").innerHTML = "Activity: Yoga";
    	 dataEntry["activity_label"] = "Yoga";   
    	 resetActBtnColor();
    	 document.getElementById('yoga-btn').style.backgroundColor ='red';  
     }   
     
     function onCyclingBtnClick(){
    	 console.log("Cycling Button Clicked");
    	 
    	 document.getElementById("act_label").innerHTML = "Activity: Cycling";
    	 dataEntry["activity_label"] = "Cycling";    	 
    	 resetActBtnColor();
    	 document.getElementById('cycling-btn').style.backgroundColor ='red';  
     }   
 
     function onWeightTrainingBtnClick(){
    	 console.log("Weight Training Button Clicked");
    	 
    	 document.getElementById("act_label").innerHTML = "Activity: Weight Training";
    	 dataEntry["activity_label"] = "Weight Training";    	 
    	 resetActBtnColor();
    	 document.getElementById('weight-training-btn').style.backgroundColor ='red';  
     }   
     
     function onGymExerciseBtnClick(){
    	 console.log("Gym Exercise Button Clicked");
    	 
    	 document.getElementById("act_label").innerHTML = "Activity: Gym Exercise";
    	 dataEntry["activity_label"] = "Gym Exercise";    	 
    	 resetActBtnColor();
    	 document.getElementById('gym-exercise-btn').style.backgroundColor ='red';  
     }   
     
     function onStopAllBtnClick(){
    	 console.log("stop-all button clicked");
    	 stopAll();

         var timeoutStopAll = setTimeout(function() {        	 	
     	    stopAll();
     	    document.getElementById("mode").innerHTML = "Record Stopped";
     	    document.getElementById("act_label").innerHTML = "Record Stopped";
     	    
     	    dataEntry["mode_record"] = "RecordStopped";
     	    dataEntry["activity_label"] = "RecordStopped";
     	    
     	    document.getElementById('start-all-btn').style.visibility='visible'; 
     	    document.getElementById('stop-all-btn').style.visibility='hidden';  
     	    
     	    document.getElementById('indoor-btn').style.visibility='hidden';  
     	    document.getElementById('outdoor-btn').style.visibility='hidden';
     	    document.getElementById('walking-btn').style.visibility='hidden';
     	    document.getElementById('running-btn').style.visibility='hidden'; 
     	    document.getElementById('stopAct-btn').style.visibility='hidden'; 
     	    document.getElementById('sleep-btn').style.visibility='hidden';
     	    document.getElementById('yoga-btn').style.visibility = 'hidden';
     	    document.getElementById('cycling-btn').style.visibility = 'hidden';
     	    document.getElementById('weight-training-btn').style.visibility = 'hidden';
     	    document.getElementById('gym-exercise-btn').style.visibility = 'hidden';
     	    
     	}, 2000);
     }
     
     function onResetAllBtnClick(){
    	 console.log("reset-all button clicked");
    	 resetAll();
    	 document.getElementById("mode").innerHTML = "Mode: Cleared"; 
    	 document.getElementById("act_label").innerHTML = "Activity: Cleared";
    	 dataEntry["mode_record"] = "Cleared";
    	 dataEntry["activity_label"] = "Cleared";
     }
     
     function onStartAllBtnClick(){
    	 console.log("start-all button clicked");
    	 startAll();
    	 document.getElementById("mode").innerHTML = "Mode: Started";
    	 document.getElementById("act_label").innerHTML = "Activity: NotSpecified";
    	 
    	 dataEntry["mode_record"] = "Started";
    	 dataEntry["activity_label"] = "NotSpecified";
    	 
    	 document.getElementById('start-all-btn').style.visibility='hidden';    
    	 document.getElementById('stop-all-btn').style.visibility='visible';  
    	 
    	 document.getElementById('indoor-btn').style.visibility='visible';  
    	 document.getElementById('outdoor-btn').style.visibility='visible';  
     }
     
     function onChangeGyroscope(gyroData){ 
         document.getElementById("gyro-alpha").innerHTML = 'Gyro Alpha : ' + Math.round(gyroData.alpha * 10) / 10;
         dataEntry["gyro_alpha"] = Math.round(gyroData.alpha * 10) / 10;
         document.getElementById("gyro-beta").innerHTML = 'Gyro Beta : '  + Math.round(gyroData.beta * 10) / 10;
         dataEntry["gyro_beta"] = Math.round(gyroData.beta * 10) / 10;
         document.getElementById("gyro-gamma").innerHTML = 'Gyro Gamma : '  + Math.round(gyroData.gamma * 10) / 10;
         dataEntry["gyro_gamma"] = Math.round(gyroData.gamma * 10) / 10;
     }

     
     function onChangeAccelerometer(accData){ 

         document.getElementById("acc-x").innerHTML = 'Speed X : ' + Math.round(accData.acceleration.x * 10) / 10;
         dataEntry["accelerometer_x"] = Math.round(accData.acceleration.x * 10) / 10;
         document.getElementById("acc-y").innerHTML = 'Speed Y : '  + Math.round(accData.acceleration.y * 10) / 10;
         dataEntry["accelerometer_y"] = Math.round(accData.acceleration.y * 10) / 10;
         document.getElementById("acc-z").innerHTML = 'Speed Z : '  + Math.round(accData.acceleration.z * 10) / 10;
         dataEntry["accelerometer_z"] = Math.round(accData.acceleration.z * 10) / 10;
//    	 console.log('Accelerometer_onchange: x: '+ dataEntry["accelerometer_x"]);
     
     }    
     
     function bindEvents() {
         var indoorBtnEl = document.getElementById('indoor-btn'),
             outdoorBtnEl = document.getElementById('outdoor-btn'),
             walkingBtnEl = document.getElementById('walking-btn'),
             runningBtnEl = document.getElementById('running-btn'),
             stopActBtnEl = document.getElementById('stopAct-btn'),
             sleepBtnEl = document.getElementById('sleep-btn'),
             yogaBtnEl = document.getElementById('yoga-btn'),
             cyclingBtnEl = document.getElementById('cycling-btn'),
             weightTrainingBtnEl = document.getElementById('weight-training-btn'),
             gymExerciseBtnEl = document.getElementById('gym-exercise-btn'),
             
             stopAllBtnEl = document.getElementById('stop-all-btn'),
             resetAllBtnEl = document.getElementById('reset-all-btn'),
             startAllBtnEl = document.getElementById('start-all-btn');

         //Enable buttons
         indoorBtnEl.addEventListener('click', onIndoorBtnClick);
         outdoorBtnEl.addEventListener('click', onOutdoorBtnClick);
         
         walkingBtnEl.addEventListener('click', onWalkingBtnClick);
         runningBtnEl.addEventListener('click', onRunningBtnClick);
         stopActBtnEl.addEventListener('click', onStopActBtnClick);
         sleepBtnEl.addEventListener('click', onSleepBtnClick);
         yogaBtnEl.addEventListener('click', onYogaBtnClick);
         cyclingBtnEl.addEventListener('click', onCyclingBtnClick);
         weightTrainingBtnEl.addEventListener('click', onWeightTrainingBtnClick);
         gymExerciseBtnEl.addEventListener('click', onGymExerciseBtnClick);
         
         stopAllBtnEl.addEventListener('click', onStopAllBtnClick);
         resetAllBtnEl.addEventListener('click',onResetAllBtnClick);
         startAllBtnEl.addEventListener('click',onStartAllBtnClick);
         
         
         //Enable gyroscope;
         window.addEventListener("deviceorientation", onChangeGyroscope, true);
         //Enable Accelerometer
         window.addEventListener("devicemotion", onChangeAccelerometer, true);
     }        
     /**
      * Store data
      */
     
     function recordData(){
    	
    	 if (dataEntry.mode_record == "Indoor" || dataEntry.mode_record == "Outdoor" || dataEntry.mode_record == "Started"){



             function writeToStream(fileStream){
              	fileStream.write(
                		dataEntry.mode_record+"\t"+
                		dataEntry.activity_label + "\t"+
                		dataEntry.date_year+"\t"+
                		dataEntry.date_month+"\t"+
                		dataEntry.date_day+"\t"+
                		dataEntry.time_hour+"\t"+
                		dataEntry.time_minute+"\t"+
                		dataEntry.time_second+"\t"+
                		dataEntry.battery_level+"\t"+
                		dataEntry.gyro_alpha+"\t"+
                		dataEntry.gyro_beta+"\t"+
                		dataEntry.gyro_gamma+"\t"+
                		dataEntry.accelerometer_x+"\t"+
                		dataEntry.accelerometer_y+"\t"+
                		dataEntry.accelerometer_z+"\t"+
                		dataEntry.light_level+"\t"+
                		dataEntry.magnetic_x+"\t"+
                		dataEntry.magnetic_y+"\t"+
                		dataEntry.magnetic_z+"\t"+
                		dataEntry.magnetic_accuracy+"\t"+
                		dataEntry.pressure_level+"\t"+
                		dataEntry.uv_level+"\t"+
                		dataEntry.hrm_rate+"\t"+
                		dataEntry.pedo_status+"\t"+
                		dataEntry.pedo_calorie+"\t"+
                		dataEntry.pedo_total+"\t"+
                		dataEntry.pedo_walk+"\t"+
                		dataEntry.pedo_run+"\t"+
                		dataEntry.pedo_distance+"\t"+
                		dataEntry.pedo_speed+"\t"+
                		dataEntry.gps_latitude+"\t"+
                		dataEntry.gps_longitude+"\t"+
                		dataEntry.gps_altitude+"\t"+
                		dataEntry.gps_accuracy+"\n"	
              	);
              	fileStream.close();
              	console.log('Entry writen: '+ dataEntry.time_hour+" : "+ dataEntry.time_minute+" : "+dataEntry.time_second);
              }
              
              function onResolveSuccess(dir) {
              	
              	file = dir.resolve(fileName);
              	file.openStream('a', writeToStream);
              }
              
              function onResolveError(e) {
              	console.log('message: ' + e.message);
              }
              tizen.filesystem.resolve('documents', onResolveSuccess, onResolveError, 'rw');         
                  		 
    		 
    		 
    	 }
     }
     /*
     function checkScreen()
     {
    	 if (tizen.power.isScreenOn()==true){
    		 console.log("Screen is on now");
    	 }
    	 else{
    		 tizen.power.turnScreenOn();
    		 console.log("Screen is off, turn it on now");
    	 }
     }
   
     */
     
     
     /**
      * init to start all sensors
      */

     
     function init() {
         bindEvents();  
         resetAll();
         
       
         //Update date time every 1 second
         var timerUpdateDateTimeBattery = setInterval(function() {        	 	
        	    updateDateTimeBattery()
        	}, 1000);

         //Set CPU as always awake
         var timerCheckScreen = setInterval(function() {    
     	    tizen.power.request("CPU","CPU_AWAKE");
     	    tizen.power.request("SCREEN", "SCREEN_DIM");
     	   
     	 }, 60000);
         
         
         var timerLightSensor = setInterval(function() {
        	 console.log("start light sensor");
        	 startLight();
        	 var timeoutLightSensor = setTimeout(function() {  
        		 console.log("stop light sensor");
        		 stopLight();
          	}, 5000);   
     	 }, 60000);
         
         // wait 10 seconds then record data every 1 second
         
         var timeoutRecordData = setTimeout(function() {  
             var timerRecordData = setInterval(function() {
            	 recordData();
               }, 1000);        	 
      	}, 10000);           
               

     }

     function startAll(){
    	 

         //start sensor
         console.log("start sensors");
         startPedometer();
         startHRM();
         //startGPS();
         startLight();
         //startMagnetic();
         //startPressure();
         //startUV();    

         
         function onResolveSuccess(dir) {
        	fileName = "sensor_data_"+dataEntry.date_year+"_"+dataEntry.date_month+"_"+dataEntry.date_day+"_"+dataEntry.time_hour+"_"+dataEntry.time_minute+"_"+dataEntry.time_second
         	dir.createFile(fileName);
        	console.log("created file: "+ fileName);
         }
         
         function onResolveError(e) {
         	console.log('message: ' + e.message);
         }
         
         tizen.filesystem.resolve('documents', onResolveSuccess, onResolveError, 'rw');         
         
         
     }
     /**
      * stop all sensors
      */
     function stopAll() {
    	 stopPedometer();
    	 stopHRM();
    	 //stopGPS();
    	 stopLight();
    	 //stopMagnetic();
    	 //stopPressure();
    	 //stopUV();
     }
     function resetAll(){
    	 resetPedometer();
    	 resetHRM();
    	 //resetGPS();
    	 resetLight();
    	 //resetMagnetic();
    	 //resetPressure();
    	 //resetUV();
     }
     
})();
