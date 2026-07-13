from rest_framework import viewsets
from .models import User, Scores
from .serializers import UserSerializer, ScoreSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ScoreViewSet(viewsets.ModelViewSet):
    serializer_class = ScoreSerializer
    def get_queryset(self):
        return Scores.objects.all().order_by('-score')[:10]

