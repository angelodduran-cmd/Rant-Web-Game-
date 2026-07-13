from django.urls import path,include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,)
from .views import *
from rest_framework.routers import DefaultRouter

router=DefaultRouter()
router.register(r'User',UserViewSet,basename='user')
router.register(r'Score',ScoreViewSet,basename='score')

urlpatterns = [
    path('api/Data/',include(router.urls)),
    path('api/Login', TokenObtainPairView.as_view()),
    path('api/Login/Refresh', TokenRefreshView.as_view()),
    
]