# Generated by Django 5.1.1 on 2024-09-21 03:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='province',
            name='island',
        ),
        migrations.AddField(
            model_name='supportgroup',
            name='contact_name',
            field=models.CharField(default='Unknown', max_length=255),
        ),
        migrations.AddField(
            model_name='supportgroup',
            name='contact_number',
            field=models.CharField(default='Unknown', max_length=20),
        ),
        migrations.AddField(
            model_name='supportgroup',
            name='email',
            field=models.EmailField(default='Unknown', max_length=254),
        ),
        migrations.AddField(
            model_name='supportgroup',
            name='region',
            field=models.CharField(choices=[('NZ-NTL', 'Northland'), ('NZ-AUK', 'Auckland'), ('NZ-WKO', 'Waikato'), ('NZ-BOP', 'Bay of Plenty'), ('NZ-GIS', 'Gisborne'), ('NZ-HKB', "Hawke's Bay"), ('NZ-TKI', 'Taranaki'), ('NZ-MWT', 'Manawatu-Wanganui'), ('NZ-WGN', 'Wellington'), ('NZ-TAS', 'Tasman'), ('NZ-NSN', 'Nelson'), ('NZ-MBH', 'Marlborough'), ('NZ-WTC', 'West Coast'), ('NZ-CAN', 'Canterbury'), ('NZ-OTA', 'Otago'), ('NZ-STL', 'Southland')], default='Choose One', max_length=6),
        ),
        migrations.AlterField(
            model_name='province',
            name='name',
            field=models.CharField(choices=[('Auckland', 'Auckland'), ('Taranaki', 'Taranaki'), ("Hawke's Bay", "Hawke's Bay"), ('Wellington', 'Wellington'), ('Marlborough', 'Marlborough'), ('Nelson', 'Nelson'), ('Canterbury', 'Canterbury'), ('South Canterbury', 'South Canterbury'), ('Westland', 'Westland'), ('Otago', 'Otago'), ('Southland', 'Southland'), ('Chatham Islands', 'Chatham Islands')], max_length=50),
        ),
        migrations.AlterField(
            model_name='supportgroup',
            name='province',
            field=models.CharField(choices=[('Auckland', 'Auckland'), ('Taranaki', 'Taranaki'), ("Hawke's Bay", "Hawke's Bay"), ('Wellington', 'Wellington'), ('Marlborough', 'Marlborough'), ('Nelson', 'Nelson'), ('Canterbury', 'Canterbury'), ('South Canterbury', 'South Canterbury'), ('Westland', 'Westland'), ('Otago', 'Otago'), ('Southland', 'Southland'), ('Chatham Islands', 'Chatham Islands')], max_length=50),
        ),
    ]
