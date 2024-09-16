import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from user.models import User
from table.models import Table
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.response import Response
from rest_framework import status
from playlist.models import Playlist
from empresa.models import Empresa

@csrf_exempt
def create(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        name = data.get('name')
        table_id = data.get('table_id')
        empresa_id = data.get('empresa_id')

        try:
            table = Table.objects.get(id=table_id)
            empresa = Empresa.objects.get(id=empresa_id)

            user = User.objects.create(
                name=name,
                table=table
            )

            playlist = Playlist.objects.create(
                name=f'Playlist for {user.name}',
                table=table,
                empresa=empresa,
                user=user
            )

            response_data = {
                'user': {
                    'id': user.id,
                    'name': user.name,
                },
            }

            return JsonResponse(response_data)
        
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


def getAll(request):
    users = User.objects.all()
    users_list = list(users.values()) 

    return JsonResponse({'users': users_list})

def getOne(request, id):
    try:
        user = User.objects.filter(id=id).values().first()
        if user:
            return JsonResponse({'user': user})
        else:
            return JsonResponse({'error': 'User not found'}, status=404)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    
@csrf_exempt
def update(request, id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            name = data.get('name')

            if not name:
                return JsonResponse({'error': 'Missing name'}, status=400)

            try:
                user = User.objects.get(id=id)
                user.name = name
                user.save()

                return JsonResponse({'status': 'User updated'}, status=200)

            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Only PUT method allowed'}, status=405)
    
@csrf_exempt
def delete(request, id):
    if request.method == 'DELETE':
        try:
            user = User.objects.get(id=id)
            user.delete()
            return JsonResponse({'status': 'User deleted'}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Only DELETE method allowed'}, status=405)
    
@api_view(['GET'])
def verify_token(request):
    print(request.user)
    if request.user and request.user.is_authenticated:
        return Response({"message": "Token is valid"}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
    