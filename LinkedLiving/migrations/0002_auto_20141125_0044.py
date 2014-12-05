# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('LinkedLiving', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='gearsensor',
            name='time',
            field=models.TimeField(default=datetime.datetime.utcnow),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='gearsensor',
            name='date',
            field=models.DateField(default=datetime.date.today),
            preserve_default=True,
        ),
    ]
