from django.db import models

class Song(models.Model):
    youtube_id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=255)
    duration = models.CharField(max_length=50, default='00:00')

    def __str__(self):
        return self.name