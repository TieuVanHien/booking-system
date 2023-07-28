from django.shortcuts import render, redirect
from rest_framework.generics import RetrieveAPIView, CreateAPIView, ListCreateAPIView, ListAPIView
# from django.shortcuts import get_object_or_404
# from rest_framework.views import APIView
from django.contrib.auth.models import User, Group 
from rest_framework import viewsets, permissions, serializers, status
from rest_framework.permissions import BasePermission
from rest_framework.response import Response
from .models import Booking
from main.serializers import UserSerializer, GroupSerializer, RegisterUserSerializer, AdminUserSerializer, BookingSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('is_staff')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

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
        
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError('Email is already registered.')
        serializer.save()
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        print(serializer.initial_data)  # Check the data being sent
        if serializer.is_valid(raise_exception=True):
            try:
                self.perform_create(serializer)
            except serializers.ValidationError as err:
                return Response({'message': err}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Registration successful'}, status=status.HTTP_201_CREATED)

   


class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().filter(is_superuser=True)
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk=None, format=None):
        user = ...    
        serializer_context = {
            'request': request,
        }
        serializer = UserSerializer(user, context=serializer_context)    
        return Response(serializer.data).filter(is_staff=True)
    
    def perform_create(self, serializer):
        serializer.save(is_staff=True, is_superuser=True)
        

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
     
class UserBookingViewSet(ListCreateAPIView):
    queryset = Booking.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Booking.objects.filter(user_id=user_id)

    def perform_create(self, serializer):
        user_id = self.kwargs['user_id']
        serializer.save(user_id=user_id)
     