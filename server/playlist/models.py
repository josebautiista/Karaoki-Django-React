from django.db import models
from song.models import Song
from table.models import Table
from empresa.models import Empresa

class Playlist(models.Model):
    name = models.CharField(max_length=255)
    songs = models.ManyToManyField(Song)
    is_general = models.BooleanField()
    is_table_specific = models.BooleanField()
    table_id = models.ForeignKey(Table, on_delete=models.CASCADE, null=True)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name
