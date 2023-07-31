from datetime import datetime, timedelta
from pytz import timezone
from django.contrib.auth.models import User
from django.db import models

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    service = models.CharField(max_length=255)
    duration = models.CharField(max_length=255)
    start = models.DateTimeField()
    end = models.DateTimeField()
    phone = models.CharField(max_length=17, blank=True, null=True)
    status = models.CharField(max_length=10, blank=True, null=True)  # Add the status field

    def save(self, *args, **kwargs):
        calgary_tz = timezone('America/Edmonton')
        current_date = datetime.now(calgary_tz)
        event_start_mdt = self.start.astimezone(calgary_tz)
        two_hours_before_event = event_start_mdt - timedelta(hours=2)
        thirty_mins_before_event = event_start_mdt - timedelta(minutes=30)

        if current_date >= thirty_mins_before_event:
            self.status = 'Upcoming'
        elif current_date >= two_hours_before_event:
            self.status = 'Inactive'
        else:
            self.status = 'Active'
        
        super(Booking, self).save(*args, **kwargs)

    def __str__(self):
        return self.title
