from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    def create(self, validated_data):
        user = self.context['request'].user 
        booking = Booking.objects.create(user=user, **validated_data)
        return booking

    class Meta:
        model = Booking
        fields = ['url', 'service', 'duration', 'title', 'start', 'end']
class UserSerializer(serializers.HyperlinkedModelSerializer):
    is_staff = serializers.BooleanField()
    bookings = serializers.SerializerMethodField()

    def get_bookings(self, obj):
        bookings = Booking.objects.filter(user=obj)
        booking_serializer = BookingSerializer(bookings, many=True)
        return booking_serializer.data
    def create(self, validated_data):
        bookings_data = self.context.get('request').data.get('bookings', [])  
        user = User.objects.create(**validated_data) 
        for booking_data in bookings_data:
            booking_data['user'] = user.id 
            booking_serializer = BookingSerializer(data=booking_data)
            booking_serializer.is_valid(raise_exception=True)
            booking_serializer.save()  
        return user

    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'is_staff', 'groups', 'bookings']
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

        