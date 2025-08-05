# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    EXPERIENCE_CHOICES = [
        ('beginner', 'Beginner (0-1 years)'),
        ('intermediate', 'Intermediate (1-3 years)'),
        ('advanced', 'Advanced (3+ years)'),
        ('elite', 'Elite/Competitive'),
    ]
    
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_CHOICES, default='beginner')
    birth_date = models.DateField(null=True, blank=True)
    preferred_units = models.CharField(max_length=10, choices=[('metric', 'Metric'), ('imperial', 'Imperial')], default='imperial')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    current_vdot = models.FloatField(null=True, blank=True)
    weekly_mileage = models.IntegerField(null=True, blank=True)
    goal_race_distance = models.CharField(max_length=50, null=True, blank=True)
    goal_race_time = models.CharField(max_length=20, null=True, blank=True)
    injury_history = models.TextField(blank=True)