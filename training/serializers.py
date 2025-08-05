from rest_framework import serializers
from .models import TrainingPlan, Workout

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'

class TrainingPlanSerializer(serializers.ModelSerializer):
    workouts = WorkoutSerializer(many=True, read_only=True, source='workout_set')
    
    class Meta:
        model = TrainingPlan
        fields = ['id', 'name', 'plan_type', 'duration_weeks', 'target_vdot', 
                 'created_at', 'is_active', 'workouts'] 