from django.contrib.auth.models import models, User
from django.db import models
from django.utils import timezone

class SocialLink(models.Model):
    social_link = models.URLField(max_length=225)
    name = models.CharField(max_length=225)

class SocialMediaUsage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    url = models.URLField(max_length=225)
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(null=True, blank=True)
    def create(self, validated_data):
        user = validated_data.get('user')
        start_time = validated_data.get('start_time')
        url = validated_data.get('url')
        
        # Set the user, start_time, and url for the SocialMediaUsage object
        validated_data['user'] = user
        validated_data['start_time'] = start_time
        validated_data['url'] = url
        
        # Create and return the SocialMediaUsage object
        return super().create(validated_data)