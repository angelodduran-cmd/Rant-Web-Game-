from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    image=models.ImageField(upload_to='users/',null=True,blank=True)
    def __str__(self):
        return self.username
    
class Scores(models.Model):
    user=models.ForeignKey("User",on_delete=models.CASCADE)
    score=models.IntegerField(default=0)
    def __str__(self):
        return f"{self.user.username} : {self.score}"
    
    


