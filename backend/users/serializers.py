from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    current_latitude = serializers.SerializerMethodField()
    current_longitude = serializers.SerializerMethodField()
    last_location_update = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile_image', 'phone_number', 'current_latitude', 'current_longitude', 'last_location_update']
        read_only_fields = ['last_location_update']

    def get_current_latitude(self, obj):
        if hasattr(obj, 'userlocation'):
            return obj.userlocation.latitude
        return None

    def get_current_longitude(self, obj):
        if hasattr(obj, 'userlocation'):
            return obj.userlocation.longitude
        return None

    def get_last_location_update(self, obj):
        if hasattr(obj, 'userlocation'):
            return obj.userlocation.updated_at
        return None

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    phone_number = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'phone_number']

    def create(self, validated_data):
        email = validated_data['email']
        
        # Frontend sends "Full Name" in the 'first_name' field
        full_name = validated_data.get('first_name', '').strip()
        parts = full_name.split(' ', 1)
        if len(parts) > 1:
            first_name = parts[0]
            last_name = parts[1]
        else:
            first_name = full_name
            last_name = ''

        # Generate a random internal username since client doesn't provide one
        # and we don't want to use the email.
        import uuid
        username = f"user_{uuid.uuid4().hex[:12]}"

        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name,
            phone_number=validated_data.get('phone_number', '')
        )
        return user

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'] = serializers.EmailField()
        # Remove the default username field if it exists
        if 'username' in self.fields:
            del self.fields['username']

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
             raise AuthenticationFailed('Email and password are required.')
        
        # We need to explicitly check against the model
        from django.contrib.auth import get_user_model
        User = get_user_model()

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise AuthenticationFailed('No active account found with the given credentials')

        if not user.check_password(password):
            raise AuthenticationFailed('No active account found with the given credentials')

        if not user.is_active:
            raise AuthenticationFailed('User account is disabled.')

        refresh = RefreshToken.for_user(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'phone_number': user.phone_number,
            }
        }

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        return token
