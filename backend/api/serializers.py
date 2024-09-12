from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note

#class creation inherits class in parenthesis
class UserSerializer(serializers.ModelSerializer):
    # Meta === constructor (in Node)?
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        #extra_kwargs excludes password from being displayed in the response
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def create(self, validated_data):
        #**validated_data passes in Meta fields and returns them if valid
        user = User.objects.create_user(**validated_data)
        return user
    
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'user', 'created_at', 'last_modified', 'author']
        extra_kwargs = {'user': {'read_only': True}, 'author': {'read_only': True}}