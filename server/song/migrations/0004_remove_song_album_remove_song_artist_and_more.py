# Generated by Django 5.1.1 on 2024-09-15 12:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('song', '0003_remove_song_album_remove_song_artist_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='song',
            name='album',
        ),
        migrations.RemoveField(
            model_name='song',
            name='artist',
        ),
        migrations.RemoveField(
            model_name='song',
            name='duration_ms',
        ),
    ]
