# Generated by Django 5.1.1 on 2024-09-22 01:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0005_supportgroup_meeting_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='supportgroup',
            name='meeting_date',
            field=models.CharField(default='Contact for next meeting date', help_text="Enter meeting date, frequency, or instructions (e.g., 'Every second Tuesday', 'Monthly', 'Contact for next meeting date')", max_length=255),
        ),
    ]
