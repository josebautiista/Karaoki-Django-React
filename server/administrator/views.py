from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer
from .models import Administrator
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = Administrator.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        administrator = serializer.save()

        return Response({
            'message': 'Administrator and user created successfully',
            # Añadir tokens si es necesario
        }, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        response_data = {
            'access': str(data['access']),
            'refresh': str(data['refresh']),
            'username': data['username'],
            'email': data['email'],
            'empresa': data.get('empresa', ''),  # Maneja el caso en que `empresa` pueda no estar
            'estado': data.get('estado', ''),  # Maneja el caso en que `estado` pueda no estar
        }
        return Response(response_data, status=status.HTTP_200_OK)
