from rest_framework import serializers
from .models import *
from django.contrib.auth.password_validation import validate_password as django_validate_password


class UserSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)
    

    class Meta:
        model = User
        fields = [
             'username', 'email', 
            'password', 'image'
        ]
        extra_kwargs = {
            'password': {
                'write_only': True,
                'required': False,
                'style': {'input_type': 'password'}
            }
        }

    def validate_password(self, value):
        if not value:
            return value
        django_validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user
    

class ScoreSerializer(serializers.ModelSerializer):
     user=serializers.SlugRelatedField(
        slug_field='username', 
        queryset=User.objects.all())

     class Meta:
        model=Scores
        fields='__all__'

