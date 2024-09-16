from empresa.models import Empresa
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from empresa.serializers import EmpresaSerializer

@api_view(['GET'])
def get(request, id):
    try:
        empresa = Empresa.objects.get(id=id)
        serializer = EmpresaSerializer(empresa)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Empresa.DoesNotExist:
        return Response({'error': 'Empresa not found'}, status=status.HTTP_404_NOT_FOUND)
