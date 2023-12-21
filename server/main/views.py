from rest_framework.generics import RetrieveAPIView, CreateAPIView, ListCreateAPIView, DestroyAPIView, UpdateAPIView
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.models import User, Group
from rest_framework import viewsets, permissions, serializers, status
from rest_framework.response import Response
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.core.exceptions import ValidationError
from .models import Booking
from main.serializers import ForgotPasswordSerializer, UserSerializer, GroupSerializer, RegisterUserSerializer, AdminUserSerializer, BookingSerializer
import logging

logger = logging.getLogger(__name__)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('is_staff')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data, context={'request': request})
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
        lastname = serializer.validated_data.get('lastname')
        firstname = serializer.validated_data.get('firstname')

        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError('Username is already taken.')
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError('Email is already registered.')
        serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
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


class BookingDeleteView(DestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        booking = self.get_object()
        if booking.status == 'Inactive':
            return Response({"message": "Booking is already inactive. Cannot delete."}, status=status.HTTP_400_BAD_REQUEST)
        booking.delete()

        return Response({"message": "Booking successfully deleted."}, status=status.HTTP_204_NO_CONTENT)


class BookingUpdateView(UpdateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    partial = True

    def patch(self, request, *args, **kwargs):
        print("Request Data:", request.data)
        return self.partial_update(request, *args, **kwargs)


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'error': 'User does not exist.'}, status=status.HTTP_404_NOT_FOUND)

            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            # Construct the password reset link with uidb64 and token
            reset_link = f"http://localhost:3000/resetpassword/{uidb64}/{token}/"
            send_mail(
                'Password Reset',
                f'Click the following link to reset your password: {reset_link}',
                'jvnailandspa@example.com',
                [email],
                fail_silently=False,
            )
            return Response({'message': 'Password reset link sent to your email.'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPassword (APIView):
    def post(self, request, *args, **kwargs):
        uidb64 = kwargs.get('uidb64')
        token = kwargs.get('token')
        new_password = request.data.get('newPassword')

        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'User does not exist or Invalid reset link.'}, status=status.HTTP_404_NOT_FOUND)

        if default_token_generator.check_token(user, token):
            try:
                user.set_password(new_password)
                user.save()
                return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)
            except ValidationError as e:
                return Response({'error': 'User does not exist or Invalid reset link.'}, status=status.HTTP_404_NOT_FOUND)
