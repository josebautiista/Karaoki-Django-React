from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import Playlist
from .serializers import PlaylistSerializer
from song.models import Song
from rest_framework.parsers import JSONParser

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

@require_http_methods(["PUT"])
def update(request, id):
    playlist = get_object_or_404(Playlist, id=id)
    serializer = PlaylistSerializer(playlist, data=request.POST, partial=True)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data)
    return JsonResponse(serializer.errors, status=400)
