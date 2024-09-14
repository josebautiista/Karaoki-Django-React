# playlist/serializers.py
from rest_framework import serializers
from .models import Playlist
from song.models import Song
from song.serializers import SongSerializer

class PlaylistSerializer(serializers.ModelSerializer):
    songs = serializers.ListField(child=serializers.IntegerField(), required=False)

    class Meta:
        model = Playlist
        fields = ['name', 'is_general', 'is_table_specific', 'table_id', 'empresa', 'songs']

    def create(self, validated_data):
        songs_data = validated_data.pop('songs', [])
        playlist = Playlist.objects.create(**validated_data)
        for song_id in songs_data:
            song, created = Song.objects.get_or_create(youtube_id=song_id)
            playlist.songs.add(song)
        return playlist
