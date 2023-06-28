from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login as auth_login
from django.http import JsonResponse
import json

import json

User = get_user_model()

def hello(request):
    return HttpResponse('Hello, world')

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
                return JsonResponse({'message': 'Login successful'}, status=200)
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

