from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.middleware.csrf import get_token
import json

User = get_user_model()

def hello(request):
    return HttpResponse('Hello, world')

def get_csrf_token(request):
    csrftoken = get_token(request)
    return JsonResponse({'csrftoken': csrftoken})

@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            email = data.get('email')
            print(data)
            print(username)
            print(password)
            print(email)

            if not username or not password or not email:
                return JsonResponse({'message': 'Username, password, and email are required'}, status=400)

            if User.objects.filter(email=email).exists():
                return JsonResponse({'message': 'User with this email already exists'}, status=409)

            User.objects.create_user(username=username, password=password, email=email)
            return JsonResponse({'message': 'Registration successful'}, status=201)
        except Exception as e:
            print(e)
            return JsonResponse({'message': 'Registration failed'}, status=500)
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)
