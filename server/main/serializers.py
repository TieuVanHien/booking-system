from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Booking

#     class Meta:
#         model = Booking
#         fields = ['url', 'service', 'duration', 'title', 'start', 'end', 'user','booking_detail_url' ]
class UserSerializer(serializers.HyperlinkedModelSerializer):
    is_staff = serializers.BooleanField()

    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        return user

    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'is_staff', 'groups']
        extra_kwargs = {
            'password': {'write_only': True},
        }

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

class AdminUserSerializer(serializers.HyperlinkedModelSerializer):
    is_staff = serializers.BooleanField(default=True)

    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'password', 'groups', 'is_staff']
        extra_kwargs = {
            'password': {'write_only': True},
        }

        