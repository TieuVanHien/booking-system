from django.shortcuts import render, redirect
from rest_framework.generics import RetrieveAPIView, CreateAPIView
from rest_framework.views import APIView
from django.contrib.auth.models import User, Group 
from rest_framework import viewsets, permissions, serializers, status
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from main.serializers import UserSerializer, GroupSerializer, SocialLinkSerializer, RegisterUserSerializer, SocialMediaUsageSerializer
from main.models import SocialLink, SocialMediaUsage
from datetime import datetime
from django.utils import timezone
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('username')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

class SocialLinkViewSet(viewsets.ModelViewSet):
    queryset = SocialLink.objects.all()
    serializer_class = SocialLinkSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class UserAPIView(RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    def get_object(self):
        return self.request.user
class RegisterUserAPIView(CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterUserSerializer
    
    def perform_create(self, serializer):
        username = serializer.validated_data.get('username')
        email = serializer.validated_data.get('email')
        
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError('Username is already registered.')
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError('Email is already registered.')
        serializer.save()
        
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_create(serializer)
        except serializers.ValidationError as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'Registration successful'}, status=status.HTTP_201_CREATED)

class SocialMediaTrackerAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SocialMediaUsageSerializer
    def post(self, request):
        serializer = SocialMediaUsageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        tz = timezone.get_current_timezone()
        start_time = timezone.localtime(timezone.now(), tz)
        url = serializer.validated_data.get('url')
        
        instance = serializer.save(user=request.user, start_time=start_time, url=url)
        
        end_time = timezone.localtime(timezone.now(), tz)
        duration_seconds = (end_time - start_time).total_seconds()
        duration_hours = round(duration_seconds / 3600, 2)
        
        return Response({
            'message': 'Social media usage tracked successfully',
            'duration': str(duration_hours) + ' hour(s)'
        }, status=200)
    
    def put(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        url = serializer.validated_data['url']
        
        try:
            usage = SocialMediaUsage.objects.get(user=request.user, url=url)
        except SocialMediaUsage.DoesNotExist:
            return Response({'message': 'Social media usage not found'}, status=404)
        
        start_time = usage.start_time
        end_time = timezone.now() 

        duration = end_time - start_time
        hours = duration.total_seconds() / 3600
        formatted_duration = "{:.2f} hour(s)".format(hours)

        return Response({'message': 'Social media usage updated successfully', 'duration': formatted_duration}, status=200)
        