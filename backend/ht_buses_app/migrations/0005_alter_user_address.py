# Generated by Django 4.0.1 on 2022-01-20 00:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ht_buses_app', '0004_alter_user_address'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='address',
            field=models.CharField(default='', max_length=100),
        ),
    ]