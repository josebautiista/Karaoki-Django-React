from django.urls import path
from . import views

urlpatterns = [
    path('get/<int:id>/', views.getAll, name='getAll'),
    path('create/', views.create, name='create'),
    path('update/<int:id>/', views.update, name='update'),
    path('getPlaylist/', views.getPlaylist, name='getPlaylist'),
    path('getUser/<int:id>/', views.getSongsByUser, name='getSongsByUser'),
    path('updateState/<str:id>/', views.updateState, name='update'),
    path('delete/<str:video_id>/<int:user_id>/', views.delete, name='playlist-delete'),
]
