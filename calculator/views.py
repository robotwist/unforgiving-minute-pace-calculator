
# calculator/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .services import VDOTCalculator, McMillanCalculator, RiegelCalculator
from .serializers import PaceCalculationSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def calculate_paces(request):
    """Calculate training paces using different methods"""
    data = request.data
    
    # Parse input
    race_time = data.get('race_time')  # "MM:SS" or "HH:MM:SS"
    race_distance = data.get('race_distance')  # "5K", "10K", etc.
    calculator_type = data.get('calculator_type', 'daniels_vdot')
    
    # Convert time to seconds
    time_parts = race_time.split(':')
    if len(time_parts) == 2:
        time_seconds = int(time_parts[0]) * 60 + int(time_parts[1])
    elif len(time_parts) == 3:
        time_seconds = int(time_parts[0]) * 3600 + int(time_parts[1]) * 60 + int(time_parts[2])
    else:
        return Response({'error': 'Invalid time format'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Convert distance to meters
    distance_map = {
        '5K': 5000,
        '10K': 10000,
        '15K': 15000,
        'Half Marathon': 21097,
        'Marathon': 42195
    }
    
    distance_meters = distance_map.get(race_distance)
    if not distance_meters:
        return Response({'error': 'Invalid distance'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Calculate paces based on selected method
    if calculator_type == 'daniels_vdot':
        vdot = VDOTCalculator.calculate_vdot(time_seconds, distance_meters)
        paces = VDOTCalculator.get_training_paces(vdot)
        result = {'vdot': vdot, 'paces': paces, 'method': 'Daniels VDOT'}
        
    elif calculator_type == 'mcmillan':
        paces = McMillanCalculator.get_training_paces(time_seconds, distance_meters)
        equivalent_times = McMillanCalculator.calculate_equivalent_times(time_seconds, distance_meters)
        result = {'paces': paces, 'equivalent_times': equivalent_times, 'method': 'McMillan'}
        
    elif calculator_type == 'riegel':
        paces = RiegelCalculator.get_training_paces(time_seconds, distance_meters)
        fitness_factor = RiegelCalculator.calculate_fitness_factor(time_seconds, distance_meters)
        result = {'paces': paces, 'fitness_factor': fitness_factor, 'method': 'Riegel Formula'}
        
    else:
        return Response({'error': 'Invalid calculator type'}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(result)