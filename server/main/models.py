from django.contrib.auth.models import models
from django.db import models


class SocialLink(models.Model):
    social_link = models.URLField(max_length=225)
    name = models.CharField(max_length=225)
    