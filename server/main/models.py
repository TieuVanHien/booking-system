from django.db import models
from django.contrib.auth.models import User
from pytz import timezone
from datetime import datetime, timedelta
from background_task import background

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    service = models.CharField(max_length=255)
    duration = models.CharField(max_length=255)
    start = models.DateTimeField()
    end = models.DateTimeField()
    phone = models.CharField(max_length=17, blank=True, null=True)
    status = models.CharField(max_length=10, blank=True, null=True) 

    def save(self, *args, **kwargs):
        calgary_tz = timezone('America/Edmonton')
        current_date = datetime.now(calgary_tz)
        event_start_mdt = self.start.astimezone(calgary_tz)
        thirty_mins_before_event = event_start_mdt - timedelta(minutes=30)

        if current_date >= event_start_mdt:
            self.status = 'Inactive'
        elif current_date >= thirty_mins_before_event:
            self.status = 'Upcoming'
        else:
            self.status = 'Active'
        
        super(Booking, self).save(*args, **kwargs)
    
    @background(schedule=60)  
    def update_event_statuses():
        calgary_tz = timezone('America/Edmonton')
        current_date = datetime.now(calgary_tz)
        for event in Booking.objects.all():
            event_start_mdt = event.start.astimezone(calgary_tz)
            thirty_mins_before_event = event_start_mdt - timedelta(minutes=30)

        if current_date >= event_start_mdt:
            event.status = 'Inactive'
        elif current_date >= thirty_mins_before_event:
            event.status = 'Upcoming'
        else:
            event.status = 'Active'

        event.save()
    def __str__(self):
        return self.title


