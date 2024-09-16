from django.db import models
from empresa.models import Empresa

class Table(models.Model):
    table_number = models.IntegerField()
    max_songs = models.IntegerField(default=10)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)
    estado = models.BooleanField(default=True)
    
    def __str__(self):
        return str(self.table_number)