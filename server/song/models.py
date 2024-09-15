from django.db import models

class Song(models.Model):
    youtube_id = models.CharField(max_length=100, primary_key=True)
    title = models.CharField(max_length=255, default="")
    duration = models.CharField(max_length=50, default='00:00')
    thumbnail = models.CharField(max_length=255, default="")
    url = models.CharField(max_length=255, default="")

    def __str__(self):
        return self.name