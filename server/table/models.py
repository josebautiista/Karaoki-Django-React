from django.db import models

class Table(models.Model):
    table_number = models.IntegerField()
    max_songs = models.IntegerField()
    
    def __str__(self):
        return str(self.table_number)