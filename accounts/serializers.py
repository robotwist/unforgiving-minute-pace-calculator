from rest_framework import serializers
from .models import User, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.first_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_experience = serializers.CharField(source='user.experience_level', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user_name', 'user_email', 'user_experience',
            'current_vdot', 'weekly_mileage', 'goal_race_distance',
            'goal_race_time', 'injury_history'
        ] 