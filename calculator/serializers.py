from rest_framework import serializers
from .models import PaceCalculation

class PaceCalculationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaceCalculation
        fields = '__all__' 