from django.contrib import admin
from .models import TrainingPlan, Workout

@admin.register(TrainingPlan)
class TrainingPlanAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'target_vdot', 'duration_weeks', 'created_at')
    list_filter = ('target_vdot', 'duration_weeks', 'created_at')
    search_fields = ('name', 'user__username')

@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('training_plan', 'day', 'workout_type', 'description')
    list_filter = ('workout_type', 'day')
    search_fields = ('description', 'training_plan__name') 