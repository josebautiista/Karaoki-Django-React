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
from rest_framework.response import Response
from user.models import User
from rest_framework import status

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
        user = User.objects.get(id=user_id)
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
        
        PlaylistSong.objects.get_or_create(
            playlist=playlist,
            song=song,
            user=user,
            play=False
        )

    serializer = PlaylistSerializer(playlist)
    return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
def getPlaylist(request):
    data = request.data
    
    empresa_id = data.get('empresa_id')
    table_id = data.get('table_id')
    user_id = data.get('user_id')
    
    if not empresa_id:
        return Response({'status': 'error', 'message': 'Missing empresa_id'}, status=400)
    
    filters = {'empresa_id': empresa_id}

    if table_id:
        filters['table_id'] = table_id

    if user_id:
        filters['user_id'] = user_id

    try:
        playlists = Playlist.objects.filter(**filters).distinct()
        
        if not playlists.exists():
            return Response([], status=200)  # Devuelve un array vacío si no hay playlists
        
        songs_data = []
        mesa_songs = {}

        for playlist in playlists:
            playlist_songs = PlaylistSong.objects.filter(playlist=playlist, play=False).select_related('song', 'user')
            mesa_id = playlist.table.id if playlist.table else None
            for ps in playlist_songs:
                song = ps.song
                user_name = ps.user.name if ps.user else 'Desconocido'

                if mesa_id not in mesa_songs:
                    mesa_songs[mesa_id] = []
                mesa_songs[mesa_id].append({
                    'youtube_id': song.youtube_id,
                    'title': song.title,
                    'duration': song.duration,
                    'url': song.url,
                    'thumbnail': song.thumbnail,
                    'user_name': user_name, 
                    'play': ps.play,
                    'fecha_agregado': ps.fecha_agregado,
                    'table_id': mesa_id
                })

        if not mesa_songs:
            return Response([], status=200)

        for mesa in mesa_songs.values():
            mesa.sort(key=lambda x: x['fecha_agregado'])

        max_length = max((len(songs) for songs in mesa_songs.values()), default=0)
        
        for i in range(max_length):
            for mesa_id, songs in mesa_songs.items():
                if i < len(songs):
                    songs_data.append(songs[i])

        return Response(songs_data, status=200)
    
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
def getSongsByUser(request, id):
    try:
        user = User.objects.get(id=id)
        count = PlaylistSong.objects.filter(user=user, play=False).count() 

        return Response({'count': count}, status=200)
    except User.DoesNotExist:
        return Response({'message': 'User not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['PUT'])
def updateState(request, id):
    try:
        playlists = PlaylistSong.objects.filter(song=id)
        if not playlists.exists():
            return Response({'message': 'PlaylistSong not found'}, status=404)

        for playlist in playlists:
            playlist.play = True
            playlist.save()

        return Response({'play': True}, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
@api_view(['DELETE'])
def delete(request, video_id, user_id):
    try:
        ps = PlaylistSong.objects.get(song=video_id, user=user_id)
        print("song", ps)
        ps.delete()

        return Response({'status': 'deleted'}, status=status.HTTP_200_OK)
    except PlaylistSong.DoesNotExist:
        return Response({'error': 'PlaylistSong not found'}, status=status.HTTP_404_NOT_FOUND)