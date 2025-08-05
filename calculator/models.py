# calculator/models.py
from django.db import models

class PaceCalculation(models.Model):
    CALCULATOR_TYPES = [
        ('daniels_vdot', 'Daniels VDOT'),
        ('mcmillan', 'McMillan'),
        ('riegel', 'Riegel Formula'),
        ('cameron', 'Cameron Model'),
    ]
    
    calculator_type = models.CharField(max_length=20, choices=CALCULATOR_TYPES)
    race_distance = models.CharField(max_length=20)
    race_time_seconds = models.IntegerField()
    calculated_vdot = models.FloatField()
    easy_pace = models.CharField(max_length=10)
    marathon_pace = models.CharField(max_length=10)
    threshold_pace = models.CharField(max_length=10)
    interval_pace = models.CharField(max_length=10)
    repetition_pace = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)