from rest_framework import serializers
from .models import Playlist
from song.models import Song
from song.serializers import SongSerializer
from table.models import Table
from empresa.models import Empresa
from user.models import User

class PlaylistSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True, required=False)
    table = serializers.PrimaryKeyRelatedField(queryset=Table.objects.all(), required=False)
    empresa = serializers.PrimaryKeyRelatedField(queryset=Empresa.objects.all(), required=False)
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)

    class Meta:
        model = Playlist
        fields = ['id', 'name', 'table', 'empresa', 'user', 'songs', 'fecha_creacion']

    def create(self, validated_data):
        songs_data = validated_data.pop('songs', [])
        playlist = Playlist.objects.create(**validated_data)
        for song_data in songs_data:
            song, created = Song.objects.get_or_create(
                youtube_id=song_data.get('youtube_id'),
                defaults={
                    'title': song_data.get('title'),
                    'thumbnail': song_data.get('thumbnail'),
                    'duration': song_data.get('duration'),
                    'url': song_data.get('url')
                }
            )
            playlist.songs.add(song)
        return playlist

    def update(self, instance, validated_data):
        songs_data = validated_data.pop('songs', [])
        instance.name = validated_data.get('name', instance.name)
        instance.table = validated_data.get('table', instance.table)
        instance.empresa = validated_data.get('empresa', instance.empresa)
        instance.user = validated_data.get('user', instance.user)
        instance.save()

        # Actualiza las canciones
        if songs_data:
            instance.songs.clear() 
            for song_data in songs_data:
                song, created = Song.objects.get_or_create(
                    youtube_id=song_data.get('youtube_id'),
                    defaults={
                        'title': song_data.get('title'),
                        'thumbnail': song_data.get('thumbnail'),
                        'duration': song_data.get('duration'),
                        'url': song_data.get('url')
                    }
                )
                instance.songs.add(song)
        
        return instance
