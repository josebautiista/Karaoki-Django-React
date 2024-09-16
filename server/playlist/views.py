from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import Playlist
from .serializers import PlaylistSerializer
from song.models import Song
from rest_framework.parsers import JSONParser
from empresa.models import Empresa
from playlist.models import PlaylistSong
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import json


@require_http_methods(["GET"])
def getAll(request, id):
    playlists = Playlist.objects.filter(empresa_id=id)
    serializer = PlaylistSerializer(playlists, many=True)
    return JsonResponse(serializer.data, safe=False)

@require_http_methods(["POST"])
def create(request):
    data = JSONParser().parse(request)
    songs_data = data.pop('songs', [])

    serializer = PlaylistSerializer(data=data)
    if serializer.is_valid():
        playlist = serializer.save()

        for song_id in songs_data:
            song, created = Song.objects.get_or_create(youtube_id=song_id)
            playlist.songs.add(song)

        return JsonResponse(serializer.data, status=201)
    
    return JsonResponse(serializer.errors, status=400)

@csrf_exempt
@api_view(['PUT'])
def update(request, id):
    data = json.loads(request.body)

    empresa_id = data.get('empresa_id')
    user_id = data.get('user_id')
    table_id = data.get('mesa_id')

    if not empresa_id or not user_id or not table_id:
        return JsonResponse({'status': 'error', 'message': 'Missing required fields'}, status=400)

    try:
        playlist = Playlist.objects.get(empresa_id=empresa_id, table_id=table_id, user_id=user_id)
    except Playlist.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Playlist not found'}, status=404)

    video = data.get('video', {})
    youtube_id = video.get('id')
    title = video.get('title')
    thumbnail = video.get('thumbnail')
    duration = video.get('duration')
    url = video.get('url')

    if youtube_id:
        song, created = Song.objects.get_or_create(
            youtube_id=youtube_id,
            defaults={
                'title': title,
                'thumbnail': thumbnail,
                'duration': duration,
                'url': url
            }
        )
        
        # Añadir la canción a la playlist
        # Utilizar get_or_create en el modelo intermedio para evitar duplicados
        PlaylistSong.objects.get_or_create(
            playlist=playlist,
            song=song
        )

    serializer = PlaylistSerializer(playlist)
    return JsonResponse(serializer.data, safe=False)