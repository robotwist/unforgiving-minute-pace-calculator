
# training/models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class RaceResult(models.Model):
    DISTANCE_CHOICES = [
        ('5K', '5K'),
        ('10K', '10K'),
        ('15K', '15K'),
        ('half_marathon', 'Half Marathon'),
        ('marathon', 'Marathon'),
        ('custom', 'Custom'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    distance = models.CharField(max_length=20, choices=DISTANCE_CHOICES)
    custom_distance = models.FloatField(null=True, blank=True)  # in meters
    time_seconds = models.IntegerField()
    race_date = models.DateField()
    race_name = models.CharField(max_length=200, blank=True)
    elevation_gain = models.IntegerField(null=True, blank=True)  # in feet
    temperature = models.IntegerField(null=True, blank=True)  # in fahrenheit
    humidity = models.IntegerField(null=True, blank=True)  # percentage
    calculated_vdot = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

class TrainingPlan(models.Model):
    PLAN_TYPES = [
        ('5k', '5K Training'),
        ('10k', '10K Training'),
        ('half_marathon', 'Half Marathon Training'),
        ('marathon', 'Marathon Training'),
        ('custom', 'Custom Plan'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    plan_type = models.CharField(max_length=20, choices=PLAN_TYPES)
    duration_weeks = models.IntegerField()
    target_vdot = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=False)

class Workout(models.Model):
    WORKOUT_TYPES = [
        ('easy', 'Easy Run'),
        ('marathon', 'Marathon Pace'),
        ('threshold', 'Threshold/Tempo'),
        ('interval', 'Interval Training'),
        ('repetition', 'Repetition'),
        ('long', 'Long Run'),
        ('recovery', 'Recovery Run'),
    ]
    
    training_plan = models.ForeignKey(TrainingPlan, on_delete=models.CASCADE)
    week = models.IntegerField()
    day = models.IntegerField()
    workout_type = models.CharField(max_length=20, choices=WORKOUT_TYPES)
    description = models.TextField()
    distance = models.FloatField()  # in miles
    target_pace = models.CharField(max_length=20)  # format: MM:SS
    notes = models.TextField(blank=True)
