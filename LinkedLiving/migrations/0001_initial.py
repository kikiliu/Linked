# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='GearSensor',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('mode_record', models.CharField(default=b'Outdoor', max_length=7, choices=[(b'Outdoor', b'Outdoor'), (b'Indoor', b'Indoor'), (b'Started', b'Started')])),
                ('date', models.DateTimeField()),
                ('battery_level', models.IntegerField()),
                ('gyro_alpha', models.DecimalField(max_digits=4, decimal_places=1)),
                ('gyro_beta', models.DecimalField(max_digits=4, decimal_places=1)),
                ('gyro_gamma', models.DecimalField(max_digits=4, decimal_places=1)),
                ('accelerometer_x', models.DecimalField(max_digits=3, decimal_places=1)),
                ('accelerometer_y', models.DecimalField(max_digits=3, decimal_places=1)),
                ('accelerometer_z', models.DecimalField(max_digits=3, decimal_places=1)),
                ('light_level', models.IntegerField()),
                ('magnetic_x', models.DecimalField(max_digits=4, decimal_places=2)),
                ('magnetic_y', models.DecimalField(max_digits=4, decimal_places=2)),
                ('magnetic_z', models.DecimalField(max_digits=4, decimal_places=2)),
                ('magnetic_accuracy', models.CharField(default=b'ACCURACY_GOOD', max_length=16, choices=[(b'ACCURACY_BAD', b'Bad'), (b'ACCURACY_GOOD', b'Good'), (b'ACCURACY_VERYGOOD', b'VeryGood')])),
                ('pressure_level', models.DecimalField(max_digits=6, decimal_places=2)),
                ('uv_level', models.DecimalField(max_digits=3, decimal_places=2)),
                ('hrm_rate', models.IntegerField()),
                ('pedo_status', models.CharField(default=b'NOT_MOVING', max_length=10, choices=[(b'NOT_MOVING', b'Not Moving'), (b'WALKING', b'Walking')])),
                ('pedo_calorie', models.DecimalField(max_digits=10, decimal_places=2)),
                ('pedo_total', models.IntegerField()),
                ('pedo_walk', models.IntegerField()),
                ('pedo_run', models.IntegerField()),
                ('pedo_distance', models.DecimalField(max_digits=10, decimal_places=2)),
                ('pedo_speed', models.DecimalField(max_digits=3, decimal_places=1)),
                ('gps_latitude', models.DecimalField(max_digits=11, decimal_places=8)),
                ('gps_longitude', models.DecimalField(max_digits=11, decimal_places=8)),
                ('gps_altitude', models.IntegerField()),
                ('gps_accuracy', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
