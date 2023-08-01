from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'groups', views.GroupViewSet, basename='group')
router.register(r'admin', views.AdminUserViewSet, basename='admin-user')
router.register(r'bookings', views.BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth', include('rest_framework.urls', namespace='rest_framework')),
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('api/user/', views.UserAPIView.as_view(), name='login'),
    path('api/register/', views.RegisterUserAPIView.as_view(), name='register'),
    path('api/users/<int:user_id>/bookings/', views.UserBookingViewSet.as_view(), name='user-bookings'),
    path('api/bookings/<int:pk>/delete/', views.BookingDeleteView.as_view(), name='booking_delete'),
]
