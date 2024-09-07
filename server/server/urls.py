from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from user.views import verify_token
from administrator import views
from administrator.views import CustomTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('administrator/', include('administrator.urls')),
    path('user/', include('user.urls')),
    path('song/', include('song.urls')),
    path('table/', include('table.urls')),
    path('playlist/', include('playlist.urls')),
    path('login/', CustomTokenObtainPairView.as_view(), name='token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify-token/', verify_token, name='verify_token'),
    path('registro/', views.RegisterView.as_view(), name='registro'),
]
