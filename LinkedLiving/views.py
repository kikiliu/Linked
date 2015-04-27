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

timezone_offset = 25200

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
            raw_line['daily_max_hr'] = int(line[1])
            raw_line['daily_avg_hr_sleep'] = int(line[2])
            raw_line['daily_avg_hr_rest'] = int(line[3])
            raw_line['daily_hr_threshold_high'] = float(line[4])
            raw_line['daily_hr_threshold_low'] = float(line[5])
            raw_line['daily_exercise_mins'] = int(line[6])
            raw_line['daily_sleep_hours'] = float(line[7])
            raw_line['daily_intensive_exercise_mins'] = int(line[8])
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
        query_start_timestamp = int(request.GET.get('start_datetime','-1')) - timezone_offset
        query_end_timestamp = int(request.GET.get('end_datetime','-1')) - timezone_offset

        response_data = []

        for entry in GearData.activity_detection_data:

            start_timestamp = totimestamp(entry['start_date_time']) + timezone_offset
            end_timestamp = totimestamp(entry['end_date_time']) + timezone_offset
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
        query_start_timestamp = int(request.GET.get('start_datetime','-1'))- timezone_offset
        query_end_timestamp = int(request.GET.get('end_datetime','-1'))- timezone_offset
        response_data = []
        for entry in GearData.minutes_aggre_data:
            timestamp = totimestamp(entry['date_time'])
            if timestamp >= query_start_timestamp and timestamp <= query_end_timestamp:
                raw_entry = {}
                raw_entry['time_stamp'] = timestamp + timezone_offset
                raw_entry['avg_hr'] = entry['mins_avg_hr']
                response_data.append(raw_entry) 
        return JsonResponse({'table':response_data})

class GetTrendView(View):
    def get(self, request, *args, **kwargs):
        query_user = request.GET.get('user_id','-1')
        query_start_date_time = todatetime(int(request.GET.get('start_datetime','-1'))- timezone_offset) 
        query_end_date_time = todatetime(int(request.GET.get('end_datetime','-1'))- timezone_offset)

        if query_start_date_time != None:
            target_start_date = query_start_date_time.date()
        else:
            target_start_date = todatetime(1).date()

        if query_end_date_time != None:
            target_end_date = query_end_date_time.date()
        else:
            target_end_date = datetime.now().date()

        if (target_end_date - target_start_date).days < 7:
            baseline_strategy = "avg" 
        else:
            baseline_strategy = "trend"

        print target_start_date
        print target_end_date

        response_data = []


        def getBaseline(start_date,end_date, field):
            total = []
            for entry in GearData.daily_aggre_data:
                if entry['date'].date() >= start_date and entry['date'].date() <=end_date:
                    total.append(entry[field])
            
            return round(sum(total)/len(total),1)

        for entry in GearData.daily_aggre_data:
            if entry['date'].date() >= target_start_date and entry['date'].date() <=target_end_date:
                raw_entry = {}
                raw_entry['time_stamp'] = totimestamp(entry['date']) +timezone_offset
                raw_entry['max_hr'] = entry['daily_max_hr']
                raw_entry['avg_hr_rest'] = entry['daily_avg_hr_rest']
                raw_entry['avg_hr_sleep'] = entry['daily_avg_hr_sleep']
                raw_entry['percent_of_time_above_high'] = entry['daily_hr_threshold_high']
                raw_entry['percent_of_time_above_low'] = entry['daily_hr_threshold_low']
                raw_entry['exercise_duration_minutes']  = entry['daily_exercise_mins']
                raw_entry['sleep_duration_hours'] = entry['daily_sleep_hours']
                raw_entry['intense_exercise_duration_minutes'] = entry['daily_intensive_exercise_mins']

                # 7 day average
                if baseline_strategy == 'trend':
                    raw_entry['max_hr_baseline'] = getBaseline(todatetime(totimestamp(entry['date'])-6*86400).date(), entry['date'].date(),'daily_max_hr')
                    raw_entry['avg_hr_rest_baseline'] = getBaseline(todatetime(totimestamp(entry['date'])-6*86400).date(), entry['date'].date(),'daily_avg_hr_rest')
                    raw_entry['avg_hr_sleep_baseline'] = getBaseline(todatetime(totimestamp(entry['date'])-6*86400).date(), entry['date'].date(),'daily_avg_hr_sleep')
                    raw_entry['percent_of_time_above_high_baseline'] = getBaseline(todatetime(totimestamp(entry['date'])-6*86400).date(), entry['date'].date(),'daily_hr_threshold_high')
                    raw_entry['percent_of_time_above_low_baseline'] = getBaseline(todatetime(totimestamp(entry['date'])-6*86400).date(), entry['date'].date(),'daily_hr_threshold_low')
                # less than 7 day average
                elif baseline_strategy == 'avg':
                    raw_entry['max_hr_baseline'] = getBaseline(target_start_date,target_end_date,'daily_max_hr')
                    raw_entry['avg_hr_rest_baseline'] = getBaseline(target_start_date,target_end_date,'daily_avg_hr_rest')
                    raw_entry['avg_hr_sleep_baseline'] = getBaseline(target_start_date,target_end_date,'daily_avg_hr_sleep')
                    raw_entry['percent_of_time_above_high_baseline'] = getBaseline(target_start_date,target_end_date,'daily_hr_threshold_high')
                    raw_entry['percent_of_time_above_low_baseline'] = getBaseline(target_start_date,target_end_date,'daily_hr_threshold_low')
                
                # add activity target
                raw_entry['exercise_duration_minutes_baseline'] = 20
                raw_entry['sleep_duration_hours_baseline'] = 7.5
                raw_entry['intense_exercise_duration_minutes_baseline'] = 10

                # add total steps
                total_steps = 0
                for min_entry in GearData.minutes_aggre_data:
                    timestamp = totimestamp(min_entry['date_time'])
                    if todatetime(timestamp).date() == entry['date'].date():
                        if min_entry['mins_label'] != 'NOT_MOVING':
                            total_steps += int(min_entry['mins_total_steps'])
                raw_entry['total_steps'] = total_steps
                # add total steps target
                raw_entry['total_steps_baseline'] = 2500

                response_data.append(raw_entry)


        return JsonResponse({'table':response_data})


class GetHealthInfoView(View):
    def get(self, request, *args, **kwargs):
    	query_user = request.GET.get('user_id','-1')
    	query_start_date_time = todatetime(int(request.GET.get('start_datetime','-1'))-timezone_offset)
    	query_end_date_time = todatetime(int(request.GET.get('end_datetime','-1'))-timezone_offset)

    	response_data = {}


        #avg_hr
        avg_hr_weekly_total = []
        for entry in GearData.daily_aggre_data:
            if entry['date'].date() >= query_start_date_time.date() and entry['date'].date() <=query_end_date_time.date():
                #avg_hr
                response_data['avg_hr'] = entry['daily_avg_hr_rest']

            #avg_hr_weekly_benchmark
            if ((query_start_date_time.date()-entry['date'].date()).days % 7 ==0) and (entry['date'].date() != query_start_date_time.date()):
                avg_hr_weekly_total.append(int(entry['daily_avg_hr_rest']))
        
        #avg_hr_weekly_benchmark

        if len(avg_hr_weekly_total) == 0:
            response_data['avg_hr_weekly_benchmark'] = 0
        else:
            response_data['avg_hr_weekly_benchmark'] = sum(avg_hr_weekly_total)*1.0/len(avg_hr_weekly_total)
        
        #avg_hr_target
        response_data['avg_hr_target'] = 80

        #total_steps
        total_steps = 0

        total_steps_weekly_total = []
        total_steps_weekly_date = []
        for entry in GearData.minutes_aggre_data:
            timestamp = totimestamp(entry['date_time'])
            if timestamp >= totimestamp(query_start_date_time) and timestamp <= totimestamp(query_end_date_time):
                if entry['mins_label'] != 'NOT_MOVING':
                    total_steps += int(entry['mins_total_steps'])
            if ((query_start_date_time.date() - todatetime(timestamp).date()).days % 7 == 0) and (todatetime(timestamp).date() != query_start_date_time.date() ):
                total_steps_weekly_total.append(int(entry['mins_total_steps']))
                total_steps_weekly_date.append(todatetime(timestamp).date())
        response_data['total_steps'] = total_steps
        #total_steps_weekly_benchmark
        if len(set(total_steps_weekly_date)) == 0:
            response_data['total_steps_weekly_benchmark'] = 0
        else:
            response_data['total_steps_weekly_benchmark'] = sum(total_steps_weekly_total)/ len(set(total_steps_weekly_date))

        #total_steps_target
        response_data['total_steps_target'] = 2500


        #exercise_time
        exercise_time = 0

        exercise_time_weekly_total = []
        exercise_time_weekly_date = []
        for entry in GearData.activity_detection_data:
            start_timestamp = totimestamp(entry['start_date_time'])
            end_timestamp = totimestamp(entry['end_date_time'])
            if start_timestamp >= totimestamp(query_start_date_time) and end_timestamp <= totimestamp(query_end_date_time):
                if entry['activity_label'] != 'SLEEPING':
                    exercise_time += int (entry['duration_mins'])
            if ((query_start_date_time.date() - todatetime(start_timestamp).date()).days % 7 ==0) and (todatetime(start_timestamp).date() != query_start_date_time.date()):
                if entry['activity_label'] != 'SLEEPING':
                    exercise_time_weekly_total.append(int (entry['duration_mins']))
                    exercise_time_weekly_date.append(todatetime(start_timestamp).date())
        response_data['exercise_time'] = exercise_time

        #exercise_time_weekly_benchmark
        if len(set(exercise_time_weekly_date)) == 0:
            response_data['exercise_time_weekly_benchmark'] = 0
        else:
            response_data['exercise_time_weekly_benchmark'] = sum(exercise_time_weekly_total)/ len(set(exercise_time_weekly_date))
        #exercise_time_target
        response_data['exercise_time_target'] = 20


        #get week day

        if query_start_date_time.weekday() == 0:
            weekday = "Monday"
        elif query_start_date_time.weekday() == 1:
            weekday = "Tuesday"
        elif query_start_date_time.weekday() == 2:
            weekday = "Wednesday"
        elif query_start_date_time.weekday() == 3:
            weekday = "Thursday"
        elif query_start_date_time.weekday() == 4:
            weekday = "Friday"
        elif query_start_date_time.weekday() == 5:
            weekday = "Saturday"
        elif query_start_date_time.weekday() == 6:
            weekday = "Sunday"

        # story line:
        if response_data['avg_hr'] == 0 or response_data['avg_hr_weekly_benchmark'] == 0:
            response_data['avg_hr_storyline'] = "Not enough info."
        else:
            ratio = response_data['avg_hr']*1.0/ response_data['avg_hr_weekly_benchmark']

            if ratio <0.9:
                response_data['avg_hr_storyline'] = "Average heart rate is less than the average on "+ weekday
            elif ratio > 1.1:
                response_data['avg_hr_storyline'] = "Average heart rate is more than the average on "+ weekday           
            else:
                response_data['avg_hr_storyline'] = "Average heart rate is in regular range."

        # story line:
        if response_data['exercise_time'] == 0 or response_data['exercise_time_weekly_benchmark'] == 0:
            response_data['exercise_time_storyline'] = "Not enough info."
        else:
            ratio = response_data['exercise_time']*1.0/ response_data['exercise_time_weekly_benchmark']

            if ratio <0.9:
                response_data['exercise_time_storyline'] = "Exercise time is less than the average on "+ weekday
            elif ratio > 1.1:
                response_data['exercise_time_storyline'] = "Exercise time is more than the average on "+ weekday         
            else:
                response_data['exercise_time_storyline'] = "Exercise time is in regular range."

        # story line:
        if response_data['total_steps'] == 0 or response_data['total_steps_weekly_benchmark'] == 0:
            response_data['total_steps_storyline'] = "Not enough info."
        else:
            ratio = response_data['total_steps']*1.0/ response_data['total_steps_weekly_benchmark']

            if ratio <0.9:
                response_data['total_steps_storyline'] = "Total steps are less than the average on "+ weekday
            elif ratio > 1.1:
                response_data['total_steps_storyline'] = "Total steps are more than the average on "+ weekday            
            else:
                response_data['total_steps_storyline'] = "Total steps are in regular range."

        return JsonResponse(response_data)