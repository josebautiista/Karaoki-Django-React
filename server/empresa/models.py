from django.db import models

class Empresa(models.Model):
    name = models.CharField(max_length=100)
    tables_number = models.IntegerField()

    def __str__(self):
        return self.name
