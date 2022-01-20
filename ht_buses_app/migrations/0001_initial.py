# Generated by Django 4.0.1 on 2022-01-19 06:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.db.models.manager


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254, unique=True, verbose_name='email')),
                ('is_staff', models.BooleanField(default=False)),
                ('is_parent', models.BooleanField(default=False)),
                ('address', models.CharField(default=' ', max_length=100)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Route',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=25)),
                ('description', models.CharField(max_length=500)),
            ],
            managers=[
                ('routesTable', django.db.models.manager.Manager()),
            ],
        ),
        migrations.CreateModel(
            name='School',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('address', models.CharField(max_length=100)),
            ],
            managers=[
                ('schoolsTable', django.db.models.manager.Manager()),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('student_school_id', models.IntegerField(default=0)),
                ('route_id', models.ForeignKey(default=0, on_delete=models.SET(0), to='ht_buses_app.route')),
                ('school_id', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='ht_buses_app.school')),
                ('user_id', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            managers=[
                ('studentsTable', django.db.models.manager.Manager()),
            ],
        ),
        migrations.AddField(
            model_name='route',
            name='school_id',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='ht_buses_app.school'),
        ),
        migrations.AddIndex(
            model_name='student',
            index=models.Index(fields=['route_id'], name='ht_buses_ap_route_i_40b211_idx'),
        ),
        migrations.AddIndex(
            model_name='student',
            index=models.Index(fields=['school_id'], name='ht_buses_ap_school__45bb69_idx'),
        ),
        migrations.AddIndex(
            model_name='student',
            index=models.Index(fields=['user_id'], name='ht_buses_ap_user_id_68f1b4_idx'),
        ),
        migrations.AddIndex(
            model_name='route',
            index=models.Index(fields=['school_id'], name='ht_buses_ap_school__3a38f1_idx'),
        ),
    ]
