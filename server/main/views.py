from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.models import User, Group 
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login as auth_login
from rest_framework import viewsets
from rest_framework import permissions
from main.serializers import UserSerializer, GroupSerializer, SocialLinkSerializer
from main.models import SocialLink
from django.http import JsonResponse
import json

# User = get_user_model()

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

@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")
            print(email, password)
            if not email or not password:
                return JsonResponse({'message': 'Invalid password or email'}, status=400)
            user = authenticate(request, email=email, password=password)
            if user is not None:
                auth_login(request, user)
                # return JsonResponse({'message': 'Login successful', 'user': {'username': user.username, 'email': user.email}}, status=200)
                return redirect('/user')
            else:
                return JsonResponse({'message': 'Invalid credentials'}, status=400)           
        except Exception as e:
            print(e)
            return JsonResponse({'message': 'Failed to retrieve user information'}, status=500) 
    return JsonResponse({'message': 'Invalid email or password'}, status=400) 
            

@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            email = data.get('email')
            if not username or not password or not email:
                return JsonResponse({'message': 'Username, password, and email are required'}, status=400)

            if User.objects.filter(email=email).exists():
                return JsonResponse({'message': 'User with this email already exists'}, status=409)

            User.objects.create_user(username=username, password=password, email=email)
            return JsonResponse({'message': 'Registration successful'}, status=201)
        
        except Exception as e:
            print(e)
            return JsonResponse({'message': 'Registration failed'}, status=500)
    if request.method == 'GET':
        try:
            users = User.objects.all()
            # Create a list to store user data
            users_data = []
            # Iterate over each user and add their information to the list
            for user in users:
                user_data = {
                    'username': user.username,
                    'email': user.email,
                }
                users_data.append(user_data)
            return JsonResponse(user_data, status=200, safe=False)
        except Exception as e:
            print(e)
            return JsonResponse({'message': 'Failed to retrieve user information'}, status=500) 
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)

@csrf_exempt
@login_required
def user(request):
    if request.method == 'GET':
        user = request.user
        return JsonResponse({'user': {'username': user.username, 'email': user.email}}, status=200)
    else:
        return JsonResponse({'message': 'Method Not Allowed'}, status=405)
    
