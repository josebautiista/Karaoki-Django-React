from rest_framework import serializers
from .models import Song

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ['youtube_id', 'title', 'duration', 'thumbnail', 'url']
