from django.contrib.auth.models import User, Group
from rest_framework import serializers
from main.models import SocialLink, SocialMediaUsage
from django.utils import timezone
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'password', 'groups']
        
class RegisterUserSerializer(serializers.HyperlinkedModelSerializer):
    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],
            email = validated_data['email'],
            password= validated_data['password']
        )
        return user
    class Meta:
        model = User
        fields =    ['url','username', 'email', 'password', 'groups']
class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class SocialLinkSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SocialLink
        fields = ['name', 'social_link']

class SocialMediaUsageSerializer(serializers.HyperlinkedModelSerializer):
    duration = serializers.SerializerMethodField()

    def get_duration(self, instance):
        start_time = instance.start_time
        end_time = instance.end_time
        if start_time and end_time:
            duration = (end_time - start_time).total_seconds()
            return duration
        return 0

    def create(self, validated_data):
        start_time = timezone.now()
        return super().create({**validated_data, 'start_time': start_time})
    class Meta:
        model = SocialMediaUsage
        fields = ['url', 'start_time', 'end_time', 'duration']