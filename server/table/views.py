from rest_framework.decorators import api_view
from rest_framework.response import Response
import datetime
from user.models import User
from empresa.models import Empresa
from playlist.models import Playlist
from table.models import Table
from table.serializers import TableSerializer
from user.models import User

@api_view(['GET'])
def getAll(request, id):
    try:
        empresa = Empresa.objects.get(id=id)
        tables = Table.objects.filter(empresa=empresa)
        
        tables_data = []
    
        for table in tables:
            playlists = Playlist.objects.filter(
                table=table,
                empresa=empresa,
                fecha_creacion__date=datetime.date.today()
            )
            
            users = User.objects.filter(table=table)
            users_data = [{'id': user.id, 'name': user.name} for user in users]
            
            songs_data = []
            for playlist in playlists:
                songs = playlist.songs.all()
                user = playlist.user
                for song in songs:
                    if song.youtube_id not in [s['youtube_id'] for s in songs_data]:
                        songs_data.append({
                            'youtube_id': song.youtube_id,
                            'title': song.title,
                            'duration': song.duration,
                            'url': song.url,
                            'thumbnail': song.thumbnail,
                            'user_name': user.name,
                            'table_id': table.id
                        })
            
            tables_data.append({
                'id': table.id,
                'table_number': table.table_number,
                'max_songs': table.max_songs,
                'users': users_data,
                'songs': songs_data,
                'estado': table.estado
            })
        return Response(tables_data, status=200)
    
    except Empresa.DoesNotExist:
        return Response({'message': 'Empresa not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
@api_view(['GET'])
def getOne(request, id):
    try:
        table = Table.objects.get(id=id)
        serializer = TableSerializer(table)
        cantidad_usuarios = User.objects.filter(table=table).count()
        response_data = serializer.data
        response_data['cantidad_usuarios'] = cantidad_usuarios

        return Response(response_data, status=200)
    except Table.DoesNotExist:
        return Response({'message': 'Table not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
@api_view(['PUT'])
def update(request, id):
    try:
        table = Table.objects.get(id=id)
        max_songs = request.data.get('max_songs')
        
        if max_songs is not None:
            table.max_songs = max_songs
            table.save()
            return Response({'max_songs': table.max_songs}, status=200)
        else:
            return Response({'message': 'No max_songs provided'}, status=400)
    except Table.DoesNotExist:
        return Response({'message': 'Table not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)