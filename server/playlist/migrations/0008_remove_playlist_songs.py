# Generated by Django 5.1.1 on 2024-09-15 16:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('playlist', '0007_rename_table_id_playlist_table'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='playlist',
            name='songs',
        ),
    ]
