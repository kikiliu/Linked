from django.http import HttpResponse
from django.http import HttpRequest
from django.views.generic import View
import json
from django.http import JsonResponse
from LinkedLiving.models import GearSensor
from django.db.models import Max
from django.db.models import Avg


class GetHealthInfoView(View):
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

