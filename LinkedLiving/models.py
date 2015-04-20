from django.db import models
from random import choice
import datetime
from email import email
from bson.json_util import default

class GearSensor(models.Model):
    user = models.ForeignKey('UserInformation')
    
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
    
    
class UserInformation(models.Model):
    email = models.EmailField()
    password = models.CharField(max_length=15)
    
    user_name = models.CharField(max_length = 15)
    
    F = 'F'
    M = 'M'
    GENDER_CHOICES = (
                      (F,'Female'),
                      (M,'Male'),
                      )
    gender = models.CharField(max_length=1, 
                              choices=GENDER_CHOICES)
    bday = models.DateField()
    height = models.DecimalField(max_digits = 5, decimal_places=2)
    weight = models.DecimalField(max_digits = 4, decimal_places=1)
    

    

class RelativeInformation(models.Model):
    user = models.ForeignKey('UserInformation')
    name = models.CharField(max_length = 15)
    email = models.EmailField()
    CHILD = 'CH'
    GRANDCHILD = 'GC'
    SIBLING = 'SI'
    OTHER = 'OR'
    FRIEND = 'FR'
    DOC = 'DO'
    
    RELATION_CHOICES = (
                        (CHILD,'Child'),
                        (GRANDCHILD,'Grandchild'),
                        (SIBLING,'Sibling'),
                        (OTHER, 'Other Relatives'),
                        (FRIEND,'Friend'),
                        (DOC, 'Doctor'),
                        )
    
    relationship = models.CharField(max_length = 2,
                                    choices = RELATION_CHOICES)
    #Privacy-checkbox input
    privacy_dashboard = models.BooleanField(default=True)
    privacy_narrative = models.BooleanField(default=True)

    privacy_hr_chart = models.BooleanField(default=True)
    
    
class HealthConcern(models.Model):
    name = models.CharField(max_length = 20)

class UserConcernMapping(models.Model):
    user = models.ForeignKey('UserInformation')
    concern = models.ForeignKey('HealthConcern')
