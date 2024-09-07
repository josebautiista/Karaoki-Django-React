import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User
from table.models import Table
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.response import Response
from rest_framework import status

@csrf_exempt
def create(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            table_id = data.get('table_id')

            if not name or not table_id:
                return JsonResponse({'error': 'Missing name or table_id'}, status=400)

            try:
                table = Table.objects.get(id=table_id)
            except Table.DoesNotExist:
                table = Table(id=table_id, table_number=table_id, max_songs=10)
                table.save()

            user = User(name=name, table=table)
            user.save()
            print(user)

            return JsonResponse({'status': 'User created'}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Only POST method allowed'}, status=405)

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
    