from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.middleware.csrf import get_token


User = get_user_model()
# Create your views here.
def hello(request):
    return HttpResponse('Hello, world')

def get_csrf_token(request):
    csrftoken = get_token(request)
    return JsonResponse({'csrftoken': csrftoken})

@csrf_exempt
def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        email = request.POST.get('email')
        print(request.POST)
        print(request.POST.get('username'))
        print(request.POST.get('password'))
        print(request.POST.get('email'))
        # Perform validation
        if not username or not password or not email:
            return JsonResponse({'message': 'Username, password, and email are required'})

        # Create a new user

        try:
            User.objects.create_user(username=username, password=password, email=email)
            return JsonResponse({'message': 'Registration successful'})
        except:
            return JsonResponse({'message': 'Registration failed'})
    
    return JsonResponse({'message': 'Invalid request method'})
