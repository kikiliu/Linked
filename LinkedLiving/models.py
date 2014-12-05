from django.db import models
from random import choice
import datetime

class GearSensor(models.Model):
    OUTDOOR = 'Outdoor'
    INDOOR = 'Indoor'
    STARTED = 'Started'
    MODE_RECORD_CHOICES = (
        (OUTDOOR, 'Outdoor'),
        (INDOOR, 'Indoor'),
        (STARTED, 'Started'),
    )
    mode_record = models.CharField(max_length=7, 
                                   choices=MODE_RECORD_CHOICES,
                                   default = OUTDOOR)
    date = models.DateField(default=datetime.date.today)
    time = models.TimeField(default=datetime.datetime.utcnow)
    
    battery_level = models.IntegerField()
    
    gyro_alpha = models.DecimalField(max_digits=4, decimal_places=1)
    gyro_beta = models.DecimalField(max_digits=4, decimal_places=1)
    gyro_gamma = models.DecimalField(max_digits=4, decimal_places=1)
    
    accelerometer_x = models.DecimalField(max_digits=3, decimal_places=1)
    accelerometer_y = models.DecimalField(max_digits=3, decimal_places=1)
    accelerometer_z = models.DecimalField(max_digits=3, decimal_places=1)
    
    light_level = models.IntegerField()
    
    magnetic_x = models.DecimalField(max_digits=4, decimal_places=2)
    magnetic_y = models.DecimalField(max_digits=4, decimal_places=2)
    magnetic_z = models.DecimalField(max_digits=4, decimal_places=2)
    
    BAD = 'ACCURACY_BAD'
    GOOD = 'ACCURACY_GOOD'
    VGOOD = 'ACCURACY_VERYGOOD'
    MAG_ACC_CHOICES = (
        (BAD, 'Bad'),
        (GOOD, 'Good'),
        (VGOOD, 'VeryGood'),
    )
    magnetic_accuracy = models.CharField(max_length=16, 
                                   choices=MAG_ACC_CHOICES,
                                   default = GOOD)
    
    pressure_level = models.DecimalField(max_digits=6, decimal_places=2)
    
    uv_level = models.DecimalField(max_digits=3, decimal_places=2)
    
    hrm_rate = models.IntegerField()
    
    NOT_MOV = 'NOT_MOVING'
    WALK = 'WALKING'
    PEDO_CHOICES = (
        (NOT_MOV, 'Not Moving'),
        (WALK, 'Walking'),
    )
    pedo_status = models.CharField(max_length=10, 
                                   choices=PEDO_CHOICES,
                                   default = NOT_MOV)
    pedo_calorie = models.DecimalField(max_digits=10, decimal_places=2)
    pedo_total = models.IntegerField()
    pedo_walk = models.IntegerField()
    pedo_run = models.IntegerField()
    pedo_distance = models.DecimalField(max_digits=10, decimal_places=2)
    pedo_speed = models.DecimalField(max_digits=3, decimal_places=1)
    
    gps_latitude = models.DecimalField(max_digits=11, decimal_places=8)
    gps_longitude = models.DecimalField(max_digits=11, decimal_places=8)
    gps_altitude = models.IntegerField()
    gps_accuracy = models.IntegerField()
    
    

    
    