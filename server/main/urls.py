from django.urls import path
from . import views

urlpatterns = [
    path('', views.hello, name='hello'),
    path('register', views.register, name='register'),
    path('login', views.CustomTokenObtainPairView.as_view(), name='login'),
    path('user', views.user, name='user'),
]
