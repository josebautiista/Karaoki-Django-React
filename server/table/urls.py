from django.urls import path
from . import views

urlpatterns = [
    path('get/<int:id>/', views.getAll, name='getAll'),
    path('getOne/<int:id>/', views.getOne, name='getOne'),
    path('update/<int:id>/', views.update, name='update'),
]
