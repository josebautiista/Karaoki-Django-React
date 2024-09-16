from django.urls import path
from . import views

urlpatterns = [
    path('get/', views.getAll, name='getAll'),
    path('get/<int:id>/', views.getOne, name='getOne'),
    path('create/', views.create, name='create'),
]
