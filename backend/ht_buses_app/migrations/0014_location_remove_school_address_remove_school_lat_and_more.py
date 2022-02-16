# Generated by Django 4.0.1 on 2022-02-12 18:23

import datetime
from django.db import migrations, models
import django.db.models.deletion
import django.db.models.manager


class Migration(migrations.Migration):

    dependencies = [
        ('ht_buses_app', '0013_alter_student_route_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('address', models.CharField(max_length=100)),
                ('lat', models.FloatField(default=0)),
                ('long', models.FloatField(default=0)),
            ],
            managers=[
                ('locationTables', django.db.models.manager.Manager()),
            ],
        ),
        migrations.RemoveField(
            model_name='school',
            name='address',
        ),
        migrations.RemoveField(
            model_name='school',
            name='lat',
        ),
        migrations.RemoveField(
            model_name='school',
            name='long',
        ),
        migrations.RemoveField(
            model_name='user',
            name='address',
        ),
        migrations.RemoveField(
            model_name='user',
            name='lat',
        ),
        migrations.RemoveField(
            model_name='user',
            name='long',
        ),
        migrations.AddField(
            model_name='route',
            name='arrival',
            field=models.TimeField(default=datetime.time(0, 0)),
        ),
        migrations.AddField(
            model_name='route',
            name='departure',
            field=models.TimeField(default=datetime.time(0, 0)),
        ),
        migrations.AddField(
            model_name='route',
            name='is_complete',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='school',
            name='arrival',
            field=models.TimeField(default=datetime.time(0, 0)),
        ),
        migrations.AddField(
            model_name='school',
            name='departure',
            field=models.TimeField(default=datetime.time(0, 0)),
        ),
        migrations.AlterField(
            model_name='route',
            name='school_id',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='ht_buses_app.school'),
        ),
        migrations.CreateModel(
            name='Stop',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('order_by', models.IntegerField(default=None)),
                ('arrival', models.TimeField(default=datetime.time(0, 0))),
                ('departure', models.TimeField(default=datetime.time(0, 0))),
                ('location_id', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='ht_buses_app.location')),
                ('route_id', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='ht_buses_app.route')),
            ],
            managers=[
                ('stopTables', django.db.models.manager.Manager()),
            ],
        ),
        migrations.AddField(
            model_name='school',
            name='location_id',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='ht_buses_app.location'),
        ),
        migrations.AddField(
            model_name='user',
            name='location',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='ht_buses_app.location'),
        ),
        migrations.AddIndex(
            model_name='stop',
            index=models.Index(fields=['route_id'], name='ht_buses_ap_route_i_a0796b_idx'),
        ),
    ]