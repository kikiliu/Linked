from __future__ import division
from django.http import HttpResponse
from django.http import HttpRequest
from django.views.generic import View
import json
from django.http import JsonResponse
from LinkedLiving.models import GearSensor
from django.db.models import Max
from django.db.models import Avg
import csv

from datetime import datetime, timedelta


def totimestamp(dt, epoch=datetime(1970,1,1)):
    td = dt - epoch
    # return td.total_seconds()
    return int ((td.microseconds + (td.seconds + td.days * 86400) * 10**6) / 10**6)

def todatetime(timestamp):
    if timestamp == -1:
        return None
    else:
        return datetime.fromtimestamp(int(timestamp))

class GearData():
    #load daily aggregation data
    daily_aggre_data = []
    with open("daily_aggre_table","rU") as f:
        reader = csv.reader(f, delimiter="\t")
        for line in reader:
            raw_line = {}
            raw_line['date'] = datetime.strptime(line[0], "%Y-%m-%d")
            raw_line['daily_max_hr'] = line[1]
            raw_line['daily_avg_hr_sleep'] = line[2]
            raw_line['daily_avg_hr_rest'] = line[3]
            raw_line['daily_hr_threshold_high'] = line[4]
            raw_line['daily_hr_threshold_low'] = line[5]
            raw_line['daily_exercise_mins'] = line[6]
            raw_line['daily_sleep_hours'] = line[7]
            raw_line['daily_intensive_exercise_mins'] = line[8]
            daily_aggre_data.append(raw_line)
    #load minutes aggregation data
    minutes_aggre_data = []
    with open("minutes_aggre_table","rU") as f:
        reader = csv.reader(f, delimiter="\t")
        for line in reader:
            raw_line = {}
            raw_line['date_time'] = datetime.strptime(line[0], "%Y-%m-%d %H:%M")
            raw_line['mins_label'] = line[1]
            raw_line['mins_max_hr'] = line[2]
            raw_line['mins_avg_hr'] = line[3]
            raw_line['mins_total_steps'] = line[4]
            raw_line['mins_mannual_labels'] = line[5]
            minutes_aggre_data.append(raw_line)
    #load activity detection data
    activity_detection_data = []
    with open("activity_detection_table","rU") as f:
        reader = csv.reader(f, delimiter="\t")
        for line in reader:
            raw_line = {}
            raw_line['start_date_time'] = datetime.strptime(line[0], "%Y-%m-%d %H:%M")
            raw_line['end_date_time'] = datetime.strptime(line[1], "%Y-%m-%d %H:%M")
            raw_line['activity_label'] = line[2]
            raw_line['duration_mins'] = line[3]
            raw_line['max_hr'] = line[4]
            raw_line['avg_hr'] = line[5]
            raw_line['total_steps'] = line[6]
            activity_detection_data.append(raw_line)    





class GetActivityView(View):
    def get(self, request, *args, **kwargs):
        query_user = request.GET.get('user_id','-1')
        query_start_date_time = todatetime(int(request.GET.get('start_datetime','-1')))
        query_end_date_time = todatetime(int(request.GET.get('end_datetime','-1')))

        response_data = []

        return JsonResponse(response_data)

class GetDailyView(View):
    def get(self, request, *args, **kwargs):
        query_user = request.GET.get('user_id','-1')
        query_start_date_time = todatetime(int(request.GET.get('start_datetime','-1')))
        query_end_date_time = todatetime(int(request.GET.get('end_datetime','-1')))


        response_data = []

        return JsonResponse(response_data)

class GetTrendView(View):
    def get(self, request, *args, **kwargs):
        query_user = request.GET.get('user_id','-1')
        query_start_date_time = todatetime(int(request.GET.get('start_datetime','-1')))
        query_end_date_time = todatetime(int(request.GET.get('end_datetime','-1')))

        if query_start_date_time != None:
            target_start_date = query_start_date_time.date()
        else:
            target_start_date = todatetime(1).date()

        if query_end_date_time != None:
            target_end_date = query_end_date_time.date()
        else:
            target_end_date = datetime.now().date()

        print target_start_date
        print target_end_date

        response_data = []

        for entry in GearData.daily_aggre_data:
            if entry['date'].date() >= target_start_date and entry['date'].date() <=target_end_date:
                raw_entry = {}
                raw_entry['time_stamp'] = totimestamp(entry['date'])
                raw_entry['max_heart_rate'] = entry['daily_max_hr']
                raw_entry['avg_hr_rest'] = entry['daily_avg_hr_rest']
                raw_entry['avg_hr_sleep'] = entry['daily_avg_hr_sleep']
                raw_entry['percent_of_time_above_high'] = entry['daily_hr_threshold_high']
                raw_entry['percent_of_time_above_low'] = entry['daily_hr_threshold_low']
                raw_entry['exercise_duration_minutes']  = entry['daily_exercise_mins']
                raw_entry['sleep_duration_hours'] = entry['daily_sleep_hours']
                raw_entry['intense_exercise_duration_minutes'] = entry['daily_intensive_exercise_mins']

                response_data.append(raw_entry)
        return JsonResponse(response_data)


class GetHealthInfoView(View):
    """
    def __init__(self):
        print GearData.minutes_aggre_data
    """
    def get(self, request, *args, **kwargs):
    	query_user = request.GET.get('user_id','-1')
    	query_start_date_time = request.GET.get('start_datetime','-1')
    	query_end_date_time = request.GET.get('end_datetime','-1')

    	response_data = {}
    	response_data['query_user'] = query_user
    	response_data['query_start_date_time'] = query_start_date_time
    	response_data['query_end_date_time'] = query_end_date_time

    	#response_data['test'] = GearSensor.objects.filter(date='2014-11-19').count()

    #Get objects that within target date time range
    #TODO: Get real date time
    	target_objects = GearSensor.objects.filter(date='2014-11-19')


    #Return <max_heart_rate>
    	response_data['max_heart_rate'] = target_objects.aggregate(Max('hrm_rate'))['hrm_rate__max']
    	
    #Return <max_heart_rate_status>
    	#TODO: Read target heart rate from User Info
    	target_max_heart_rate = 160
    	if target_max_heart_rate == None:
    		response_data['max_heart_rate_status'] = 0
    	elif response_data['max_heart_rate'] > target_max_heart_rate*1.2:
    		response_data['max_heart_rate_status'] = -1
    	elif response_data['max_heart_rate'] > target_max_heart_rate*1.1:
    		response_data['max_heart_rate_status'] = -2
    	else:
    		response_data['max_heart_rate_status'] = 3

    #Return <avg_heart_rate>
    	response_data['avg_heart_rate'] = target_objects.aggregate(Avg('hrm_rate'))['hrm_rate__avg']
    	response_data['avg_heart_rate'] = round(response_data['avg_heart_rate'],0)

    #Return <avg_heart_rate_status> 
    	#TODO: Read target heart rate from User Info
    	target_avg_heart_rate_upper = 100
    	target_avg_heart_rate_lower = 60

    	if target_avg_heart_rate_lower == None or target_avg_heart_rate_upper == None:
    		response_data['avg_heart_rate_status'] = 0
    	elif response_data['avg_heart_rate'] < target_avg_heart_rate_lower*0.9:
    		response_data['avg_heart_rate_status'] = 2
    	elif response_data['avg_heart_rate'] < target_avg_heart_rate_lower:
    		response_data['avg_heart_rate_status'] = 1
    	elif response_data['avg_heart_rate'] > target_avg_heart_rate_upper:
    		response_data['avg_heart_rate_status'] = 4    		
    	elif response_data['avg_heart_rate'] > target_avg_heart_rate_upper*1.1:
    		response_data['avg_heart_rate_status'] = 5
    	else:
    		response_data['avg_heart_rate_status'] = 3

    #Return <steps>
    	response_data['steps'] = target_objects.aggregate(Max('pedo_total'))['pedo_total__max']

    #Return <steps_status>
    	#TODO: Read target steps from User Info
    	target_steps = 1500

    	if target_steps == None:
    		response_data['steps_status'] = 0
    	elif response_data['steps'] < target_steps *0.9:
    		response_data['steps_status'] = 2
    	elif response_data['steps'] < target_steps:
    		response_data['steps_status'] = 1
    	else:
    		response_data['steps_status'] = 3

    #Return <distance>
    	response_data['distance'] = target_objects.aggregate(Max('pedo_distance'))['pedo_distance__max']
    	response_data['distance'] = round (response_data['distance'],0)

    #Return <distance_status>
    	#TODO: Read target distance from User Info
    	target_distance = 1200

    	if target_distance == None:
    		response_data['distance_status'] = 0
    	elif response_data['distance'] < target_distance *0.9:
    		response_data['distance_status'] = 2
    	elif response_data['distance'] < target_distance:
    		response_data['distance_status'] = 1
    	else:
    		response_data['distance_status'] = 3    

    #Return <exercise_time>
    	response_data['exercise_time'] = round(target_objects.filter(pedo_status='WALKING').count()/60,0)


    #Return <exercise_status>
    	#TODO: Read target exercise time from User Info
    	target_exercise_time = 30

    	if target_exercise_time == None:
    		response_data['exercise_time_status'] = 0
    	elif response_data['exercise_time'] < target_exercise_time *0.9:
    		response_data['exercise_time_status'] = 2
    	elif response_data['exercise_time'] < target_exercise_time:
    		response_data['exercise_time_status'] = 1
    	else:
    		response_data['exercise_time_status'] = 3    

    #Return <high_intensity_time> <low_intensity_time>
    	#TODO: Add RUNNING in pedo_status
    	response_data['high_intensity_time'] = response_data['exercise_time'] *0.3
    	response_data['low_intensity_time'] = response_data['exercise_time'] *0.7


        return JsonResponse(response_data)

