from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Booking

class BookingHyperlinkedIdentityField(serializers.HyperlinkedIdentityField):
    def get_url(self, obj, view_name, request, format):
        lookup_value = getattr(obj, self.lookup_field)
        kwargs = {self.lookup_url_kwarg: lookup_value, 'user_id': obj.user.id}
        return self.reverse(view_name, kwargs=kwargs, request=request, format=format)

class UsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username', 'url', 'last_name', 'first_name']  
class BookingSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.CharField(source='get_absolute_url', read_only=True)
    user = UsernameSerializer(read_only=True)
    start = serializers.DateTimeField(format="%d %B %Y %H:%M")
    end = serializers.DateTimeField(format="%d %B %Y %H:%M")

    class Meta:
        model = Booking
        fields = ['url', 'title','phone','service','status', 'duration', 'start', 'end', 'user']
        lookup_field = 'id'
        
class UserSerializer(serializers.ModelSerializer):
    is_staff = serializers.BooleanField()
    bookings = BookingSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['url','id', 'username', 'first_name','last_name','email', 'is_staff', 'groups', 'bookings']
        extra_kwargs = {
            'password': {'write_only': True},
        }

class RegisterUserSerializer(serializers.HyperlinkedModelSerializer):
    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],    
            email = validated_data['email'],
            password= validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )
        return user
    class Meta:
        model = User
        fields = ['url','username', 'email', 'last_name', 'first_name','password', 'groups']
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

