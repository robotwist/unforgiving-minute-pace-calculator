from django.contrib import admin
from .models import PaceCalculation

@admin.register(PaceCalculation)
class PaceCalculationAdmin(admin.ModelAdmin):
    list_display = ('calculator_type', 'race_distance', 'calculated_vdot', 'created_at')
    list_filter = ('calculator_type', 'race_distance', 'created_at')
    search_fields = ('race_distance',) 