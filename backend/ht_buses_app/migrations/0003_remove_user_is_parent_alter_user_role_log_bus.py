# Generated by Django 4.0.1 on 2022-03-28 22:19

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ht_buses_app', '0002_alter_location_address_alter_user_email_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='is_parent',
        ),
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Administrator'), (2, 'School Staff'), (3, 'Driver'), (4, 'General'), (5, 'Student')], default=4),
        ),
        migrations.CreateModel(
            name='Log',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bus_number', models.IntegerField(default=0)),
                ('date', models.DateField(blank=True, default=datetime.date.today)),
                ('start_time', models.TimeField(blank=True, default=datetime.time(0, 0))),
                ('duration', models.DurationField(default=datetime.timedelta(0))),
                ('pickup', models.BooleanField(default=False)),
                ('route_id', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='ht_buses_app.route')),
                ('user_id', models.ForeignKey(blank=True, default=None, null=True, on_delete=models.SET(None), to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Bus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bus_number', models.IntegerField(default=0)),
                ('last_updated', models.DateTimeField(blank=True, default=datetime.datetime.now)),
                ('is_running', models.BooleanField(default=False)),
                ('location_id', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='ht_buses_app.location')),
            ],
        ),
    ]