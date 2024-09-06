from django.db import models

class Song(models.Model):
    spotify_id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    album = models.CharField(max_length=255)
    duration_ms = models.IntegerField()

    def __str__(self):
        return self.name