from django.urls import path,include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,)

urlpatterns = [
    path('api/Login', TokenObtainPairView.as_view()),
    path('api/Login/Refresh', TokenRefreshView.as_view()),
    
]