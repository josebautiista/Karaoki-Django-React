from django.db import models
from table.models import Table
from datetime import datetime

class User(models.Model):
    name = models.CharField(max_length=255)
    session_start = models.DateTimeField(default=datetime.now)
    created_at = models.DateTimeField(default=datetime.now)
    state = models.BooleanField(default=True)
    table = models.ForeignKey(Table, on_delete=models.CASCADE)    
    
    def __str__(self):
        return self.name