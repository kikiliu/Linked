from __future__ import division
from django.http import HttpResponse
from django.http import HttpRequest
from django.views.generic import View
import json
from django.http import JsonResponse
from LinkedLiving.models import GearSensor
from django.db.models import Max
from django.db.models import Avg
import random
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

def getTime(datetime):
    time = None

    # Decide time
    if datetime.time().hour < 4:
        time = 'night'
    elif datetime.time().hour < 12:
        time = 'morning'
    elif datetime.time().hour < 15:
        time = 'afternoon'
    elif datetime.time().hour < 18:
        time = 'evening'
    else:
        time = 'night'  
    return time

def getStory(start_datetime, end_datetime, label,duration):
    #get weather
    weather = None
    rand_weather = random.randint(0,9)
    if rand_weather < 6:
        weather = 'sunny'
    elif rand_weather < 9:
        weather = 'cloudy'
    else:
        weather = 'rainy'
    #get temperature
    temperature = None
    rand_temperature = random.randint(0,9)
    if rand_temperature < 6:
        temperature = 'warm'
    elif rand_temperature < 9:
        temperature = 'cool'
    else:
        temperature = 'cold'

    #get user name
    user = 'Maggie'

    if label == 'WALKING':
        return user + " walked outside for " + duration + " minutes. It was " + weather + " and " + temperature + "."
    if label == 'RUNNING':
        return user + " ran outside for " + duration + " minutes. It was " + weather + " and " + temperature + "."
    if label == 'nap':
        return user + " took a nap for " + duration + " minutes."
    if label == 'wakeup':
        return user + " woke up. It was " + str(round(float(duration)/60, 1)) + " hours sleep."
    if label == 'sleep':
        return user + " went to bed."

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
        query_start_timestamp = int(request.GET.get('start_datetime','-1'))
        query_end_timestamp = int(request.GET.get('end_datetime','-1'))

        response_data = []

        for entry in GearData.activity_detection_data:

            start_timestamp = totimestamp(entry['start_date_time'])
            end_timestamp = totimestamp(entry['end_date_time'])
            # Adding walking and running data
            if entry['activity_label'] != 'SLEEPING':
                if start_timestamp >= query_start_timestamp and end_timestamp <= query_end_timestamp:
                    raw_entry = {}
                    raw_entry['start_activity_time'] = start_timestamp
                    raw_entry['end_activity_time'] = end_timestamp
                    if entry['activity_label'] == 'WALKING':
                        raw_entry['activity_type'] = 2
                    elif entry['activity_label'] == 'RUNNING':
                        raw_entry['activity_type'] = 3
                    raw_entry['story_line'] = getStory(entry['start_date_time'], entry['end_date_time'], entry['activity_label'], entry['duration_mins'])
                    raw_entry['max_hr'] = entry['max_hr']
                    raw_entry['avg_hr'] = entry['avg_hr']
                    if int (entry['avg_hr']) > 125:
                        raw_entry['intensity'] = 1
                    else:
                        raw_entry['intensity'] = 0
                    raw_entry['steps'] = entry['total_steps']
                    if raw_entry['story_line'].find('sunny'):
                        raw_entry['background_flag'] = 1
                    elif raw_entry['story_line'].find('rainy'):
                        raw_entry['background_flag'] = 2
                    elif raw_entry['story_line'].find('cloudy'):
                        raw_entry['background_flag'] = 3
                    elif raw_entry['story_line'].find('snow'):
                        raw_entry['background_flag'] = 4
                    if getTime(entry['start_date_time']) == 'morning':
                        raw_entry['time_flag'] = 1
                    elif getTime(entry['start_date_time']) == 'afternoon':
                        raw_entry['time_flag'] = 2
                    elif getTime(entry['start_date_time']) == 'evening':
                        raw_entry['time_flag'] = 3
                    elif getTime(entry['start_date_time']) == 'night':
                        raw_entry['time_flag'] = 4                                                 
                    response_data.append(raw_entry) 
            else:
                if int (entry['duration_mins']) < 120: # user is taking nap
                    if start_timestamp >= query_start_timestamp and end_timestamp <= query_end_timestamp:    
                        raw_entry = {}
                        raw_entry['start_activity_time'] = start_timestamp
                        raw_entry['end_activity_time'] = end_timestamp
                        raw_entry['activity_type'] = 4
                        raw_entry['story_line'] = getStory(entry['start_date_time'], entry['end_date_time'], 'nap', entry['duration_mins'])
                        raw_entry['max_hr'] = entry['max_hr']
                        raw_entry['avg_hr'] = entry['avg_hr']
                        raw_entry['intensity'] = -1
                        raw_entry['steps'] = -1
                        raw_entry['background_flag'] = -1
                        if getTime(entry['start_date_time']) == 'morning':
                            raw_entry['time_flag'] = 1
                        elif getTime(entry['start_date_time']) == 'afternoon':
                            raw_entry['time_flag'] = 2
                        elif getTime(entry['start_date_time']) == 'evening':
                            raw_entry['time_flag'] = 3
                        elif getTime(entry['start_date_time']) == 'night':
                            raw_entry['time_flag'] = 4 
                        response_data.append(raw_entry) 
                else: 
                    if (getTime(entry['start_date_time']) == 'night' or getTime(entry['start_date_time']) == 'morning') \
                        and start_timestamp >= query_start_timestamp \
                        and start_timestamp <= query_end_timestamp: # user is going to sleep
                        raw_entry = {}
                        raw_entry['start_activity_time'] = start_timestamp
                        raw_entry['end_activity_time'] = None
                        raw_entry['activity_type'] = 1
                        raw_entry['story_line'] = getStory(entry['start_date_time'], entry['end_date_time'], 'sleep', entry['duration_mins'])
                        raw_entry['max_hr'] = entry['max_hr']
                        raw_entry['avg_hr'] = entry['avg_hr']
                        raw_entry['intensity'] = -1
                        raw_entry['steps'] = -1
                        raw_entry['background_flag'] = -1 
                        raw_entry['time_flag'] = -1                       
                        response_data.append(raw_entry) 
                    if (getTime(entry['end_date_time']) == 'morning' or getTime(entry['end_date_time']) == 'night')\
                         and end_timestamp >= query_start_timestamp \
                         and end_timestamp <= query_end_timestamp: # user is waking up
                        raw_entry = {}
                        raw_entry['start_activity_time'] = end_timestamp
                        raw_entry['end_activity_time'] = None
                        raw_entry['activity_type'] = 0
                        raw_entry['story_line'] = getStory(entry['start_date_time'], entry['end_date_time'], 'wakeup', entry['duration_mins'])
                        raw_entry['max_hr'] = entry['max_hr']
                        raw_entry['avg_hr'] = entry['avg_hr']
                        raw_entry['intensity'] = -1
                        raw_entry['steps'] = -1
                        raw_entry['background_flag'] = -1 
                        raw_entry['time_flag'] = -1 
                        response_data.append(raw_entry) 

        return JsonResponse({'table':response_data})

class GetDailyView(View):

    def get(self, request, *args, **kwargs):
        query_user = request.GET.get('user_id','-1')
        query_start_timestamp = int(request.GET.get('start_datetime','-1'))
        query_end_timestamp = int(request.GET.get('end_datetime','-1'))
        response_data = []
        for entry in GearData.minutes_aggre_data:
            timestamp = totimestamp(entry['date_time'])
            if timestamp >= query_start_timestamp and timestamp <= query_end_timestamp:
                raw_entry = {}
                raw_entry['time_stamp'] = timestamp
                raw_entry['avg_hr'] = entry['mins_avg_hr']
                response_data.append(raw_entry) 
        return JsonResponse({'table':response_data})

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
                raw_entry['max_hr'] = entry['daily_max_hr']
                raw_entry['avg_hr_rest'] = entry['daily_avg_hr_rest']
                raw_entry['avg_hr_sleep'] = entry['daily_avg_hr_sleep']
                raw_entry['percent_of_time_above_high'] = entry['daily_hr_threshold_high']
                raw_entry['percent_of_time_above_low'] = entry['daily_hr_threshold_low']
                raw_entry['exercise_duration_minutes']  = entry['daily_exercise_mins']
                raw_entry['sleep_duration_hours'] = entry['daily_sleep_hours']
                raw_entry['intense_exercise_duration_minutes'] = entry['daily_intensive_exercise_mins']

                response_data.append(raw_entry)
        return JsonResponse({'table':response_data})


class GetHealthInfoView(View):
    def get(self, request, *args, **kwargs):
    	query_user = request.GET.get('user_id','-1')
    	query_start_date_time = todatetime(int(request.GET.get('start_datetime','-1')))
    	query_end_date_time = todatetime(int(request.GET.get('end_datetime','-1')))

    	response_data = {}

        for entry in GearData.daily_aggre_data:
            if entry['date'].date() >= query_start_date_time.date() and entry['date'].date() <=query_end_date_time.date():
                #max_hr
                response_data['max_hr'] = entry['daily_max_hr']
                #max_hr_status
                if int(entry['daily_max_hr']) <= 180:
                    response_data['max_hr_status'] = 3
                elif int(entry['daily_max_hr']) <= 190:
                    response_data['max_hr_status'] = 2
                else:
                    response_data['max_hr_status'] = 1
                #avg_hr
                response_data['avg_hr'] = entry['daily_avg_hr_rest']
                #avg_hr_status
                if int(entry['daily_avg_hr_rest']) < 50:
                    response_data['avg_hr_status'] = 2
                elif int(entry['daily_avg_hr_rest']) < 60:
                    response_data['avg_hr_status'] = 1
                elif int(entry['daily_avg_hr_rest']) >= 60 and int(entry['daily_avg_hr_rest']) <= 100:
                    response_data['avg_hr_status'] = 3
                elif int(entry['daily_avg_hr_rest']) <= 110:
                    response_data['avg_hr_status'] = 4
                else:
                    response_data['avg_hr_status'] = 5
        #total_steps
        total_steps = 0
        for entry in GearData.minutes_aggre_data:
            timestamp = totimestamp(entry['date_time'])
            if timestamp >= totimestamp(query_start_date_time) and timestamp <= totimestamp(query_end_date_time):
                if entry['mins_label'] != 'NOT_MOVING':
                    total_steps += int(entry['mins_total_steps'])
        response_data['total_steps'] = total_steps

        #steps_status
        if total_steps < 1500:
            response_data['steps_status'] = 2
        elif total_steps < 2000:
            response_data['steps_status'] = 1
        else:
            response_data['steps_status'] = 3

        #activity_steps and exercise_time
        activity_steps = 0
        exercise_time = 0
        for entry in GearData.activity_detection_data:
            start_timestamp = totimestamp(entry['start_date_time'])
            end_timestamp = totimestamp(entry['end_date_time'])
            if start_timestamp >= totimestamp(query_start_date_time) and end_timestamp <= totimestamp(query_end_date_time):
                if entry['activity_label'] != 'SLEEPING':
                    activity_steps += int(entry['total_steps'])
                    exercise_time += int (entry['duration_mins'])
        response_data['activity_steps'] = activity_steps
        response_data['exercise_time'] = exercise_time

        #exercise_status
        if exercise_time < 15:
            response_data['exercise_status'] = 2
        elif exercise_time < 20:
            response_data['exercise_status'] = 1
        else:
            response_data['exercise_status'] = 3
        response_data['last_update'] = query_end_date_time.strftime("%Y-%m-%d") + " 11:50pm"

        return JsonResponse(response_data)

