from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.hello, name='hello'),
    path('api/register', views.register, name='register'),
]
