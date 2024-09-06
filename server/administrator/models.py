from django.db import models

class Administrator(models.Model):
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=255)

    def __str__(self):
        return self.name