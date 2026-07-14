from rest_framework import viewsets
from .models import User, Scores
from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ScoreViewSet(viewsets.ModelViewSet):
    serializer_class = ScoreSerializer
    def get_queryset(self):
        return Scores.objects.all().order_by('-score')[:10]
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class=CustomTokenObtainPairSerializer

