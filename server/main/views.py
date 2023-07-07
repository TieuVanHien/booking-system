from django.shortcuts import render, redirect
from rest_framework.generics import RetrieveAPIView, CreateAPIView
from django.contrib.auth.models import User, Group 
from rest_framework import viewsets, permissions, serializers, status
from rest_framework.response import Response
from main.serializers import UserSerializer, GroupSerializer, RegisterUserSerializer, AdminUserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('is_staff')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

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

class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().filter(is_superuser=True)
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(is_staff=True)

    def perform_create(self, serializer):
        serializer.save(is_staff=True, is_superuser=True)