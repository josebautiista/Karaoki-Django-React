# Generated by Django 5.1.1 on 2024-09-06 20:03

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('empresa', '0001_initial'),
        ('table', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='table',
            name='empresa',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='empresa.empresa'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='table',
            name='max_songs',
            field=models.IntegerField(default=10),
        ),
    ]
