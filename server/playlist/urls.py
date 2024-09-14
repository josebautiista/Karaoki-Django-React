from django.urls import path
from . import views

urlpatterns = [
    path('get/<int:id>/', views.getAll, name='getAll'),
    path('create/', views.create, name='create'),
    path('update/<int:id>/', views.update, name='update'),
]
