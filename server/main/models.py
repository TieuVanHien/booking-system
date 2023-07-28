from django.contrib.auth.models import User, models
from django.db import models

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    service = models.CharField(max_length=255)
    duration = models.CharField(max_length=255)
    start = models.DateTimeField()
    end = models.DateTimeField()
    username = models.CharField(User, max_length=255)
    phone = models.CharField(max_length=17, blank=True, null=True)
    def __str__(self):
        return self.title


