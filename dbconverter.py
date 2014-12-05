import csv, sqlite3
from LinkedLiving.models import GearSensor
import datetime

with open('tab1.txt','rU') as f:
    dr = csv.DictReader(f, delimiter='\t')
    for row in dr:
        print row
        gs = GearSensor()
        gs.mode_record = row['mode_record']
        gs.date = datetime.date(int(row['date_year']), 
                                    int(row['date_month']), 
                                    int(row['date_day']))
        gs.time = datetime.time(int(row['time_hour']), 
                                    int(row['time_minute']), 
                                    int(row['time_second']))
        gs.battery_level = row['battery_level']
        gs.gyro_alpha = row['gyro_alpha']
        gs.gyro_beta = row['gyro_beta']
        gs.gyro_gamma = row['gyro_gamma']
        gs.accelerometer_x = row['accelerometer_x']
        gs.accelerometer_y = row['accelerometer_y']
        gs.accelerometer_z = row['accelerometer_z']
        gs.light_level = row['light_level']
        gs.magnetic_x = row['magnetic_x']
        gs.magnetic_y = row['magnetic_y']
        gs.magnetic_z = row['magnetic_z']
        gs.magnetic_accuracy = row['magnetic_accuracy']
        gs.pressure_level = row['pressure_level']
        gs.uv_level = row['uv_level']
        gs.hrm_rate = row['hrm_rate']
        gs.pedo_status = row['pedo_status']
        gs.pedo_calorie = row['pedo_calorie']
        gs.pedo_total = row['pedo_total']
        gs.pedo_walk = row['pedo_walk']
        gs.pedo_run = row['pedo_run']
        gs.pedo_distance = row['pedo_distance']
        gs.pedo_speed = row['pedo_speed']
        gs.gps_latitude = row['gps_latitude']
        gs.gps_longitude = row['gps_longitude']
        gs.gps_altitude = row['gps_altitude']
        gs.gps_accuracy = row['gps_accuracy']

        gs.save()