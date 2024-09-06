from django.urls import path
from . import views

urlpatterns = [
    path('get/', views.getAll, name='getAll'),
    path('get/<int:id>/', views.getOne, name='getOne'),
    path('create/', views.create, name='create'),
    path('update/<int:id>/', views.update, name='update'),
    path('delete/<int:id>/', views.delete, name='delete'),
]
