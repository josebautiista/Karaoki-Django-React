# Generated by Django 5.1.1 on 2024-09-15 13:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('playlist', '0004_remove_playlist_is_general_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='playlist',
            name='playlist_type',
        ),
    ]
