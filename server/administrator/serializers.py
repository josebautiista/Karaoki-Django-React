from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth.models import User
from empresa.serializers import EmpresaSerializer
from .models import Administrator
from empresa.models import Empresa

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(write_only=True) 
    empresa_id = serializers.PrimaryKeyRelatedField(queryset=Empresa.objects.all(), source='empresa')

    class Meta:
        model = Administrator
        fields = ('username', 'email', 'estado', 'empresa_id', 'password')

    def create(self, validated_data):
        empresa = validated_data.pop('empresa')
        password = validated_data.pop('password')
        username = validated_data.pop('username')

        user = User.objects.create_user(
            username=username, 
            email=validated_data['email'],
            password=password
        )

        administrator = Administrator.objects.create(
            email=validated_data['email'],
            estado=validated_data.get('estado', True),
            empresa=empresa,
            user=user
        )

        return administrator

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        print(vars(user))
        data['username'] = user.username
        data['email'] = user.email
        
        if hasattr(user, 'administrator'):
            empresa = user.administrator.empresa
            data['empresa'] = EmpresaSerializer(empresa).data 
            data['estado'] = user.administrator.estado
            data['is_superuser'] = user.is_superuser
        
        return data