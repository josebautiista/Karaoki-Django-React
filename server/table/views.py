from rest_framework.decorators import api_view
from rest_framework.response import Response
import datetime
from user.models import User
from empresa.models import Empresa
from playlist.models import Playlist
from table.models import Table

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
                for song in songs:
                    if song.youtube_id not in [s['youtube_id'] for s in songs_data]:
                        songs_data.append({
                            'youtube_id': song.youtube_id,
                            'title': song.title,
                            'duration': song.duration,
                            'url': song.url,
                            'thumbnail': song.thumbnail
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
