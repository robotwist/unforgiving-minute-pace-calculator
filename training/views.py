
# training/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import TrainingPlan, Workout
from .serializers import TrainingPlanSerializer, WorkoutSerializer
from .services import TrainingPlanGenerator

User = get_user_model()

class TrainingPlanViewSet(viewsets.ModelViewSet):
    serializer_class = TrainingPlanSerializer
    
    def get_queryset(self):
        return TrainingPlan.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def generate_plan(self, request):
        """Generate a new training plan"""
        data = request.data
        plan_type = data.get('plan_type')
        target_vdot = data.get('target_vdot')
        weeks = data.get('weeks', 12)
        
        generator = TrainingPlanGenerator()
        plan = generator.create_plan(
            user=request.user,
            plan_type=plan_type,
            target_vdot=target_vdot,
            weeks=weeks
        )
        
        serializer = self.get_serializer(plan)
        return Response(serializer.data, status=status.HTTP_201_CREATED)