from django.contrib.auth.models import User, Group
from rest_framework import serializers
from main.models import SocialLink

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'password', 'groups']

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class SocialLinkSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SocialLink
        fields = ['name', 'social_link']
