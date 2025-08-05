
# training/services.py
from .models import TrainingPlan, Workout
from calculator.services import VDOTCalculator

class TrainingPlanGenerator:
    """Generate structured training plans based on VDOT"""
    
    def create_plan(self, user, plan_type, target_vdot, weeks):
        """Create a complete training plan"""
        
        plan = TrainingPlan.objects.create(
            user=user,
            name=f"{plan_type.replace('_', ' ').title()} Training Plan",
            plan_type=plan_type,
            duration_weeks=weeks,
            target_vdot=target_vdot
        )
        
        # Generate workouts for each week
        for week in range(1, weeks + 1):
            self._generate_week(plan, week, plan_type, target_vdot)
        
        return plan
    
    def _generate_week(self, plan, week_num, plan_type, vdot):
        """Generate workouts for a specific week"""
        paces = VDOTCalculator.get_training_paces(vdot)
        
        # Base weekly structure
        if plan_type == '5k':
            self._create_5k_week(plan, week_num, paces)
        elif plan_type == '10k':
            self._create_10k_week(plan, week_num, paces)
        elif plan_type == 'half_marathon':
            self._create_half_marathon_week(plan, week_num, paces)
        elif plan_type == 'marathon':
            self._create_marathon_week(plan, week_num, paces)
    
    def _create_5k_week(self, plan, week, paces):
        """Create 5K focused training week"""
        workouts = [
            (1, 'easy', f"Easy run 4-6 miles at {paces['easy']} pace", 5.0),
            (2, 'interval', f"5x1000m at {paces['interval']} pace with 400m jog recovery", 6.0),
            (3, 'easy', f"Easy run 3-4 miles at {paces['easy']} pace", 3.5),
            (4, 'threshold', f"20 minutes at {paces['threshold']} pace", 4.0),
            (5, 'easy', f"Easy run 3-4 miles at {paces['easy']} pace", 3.5),
            (6, 'repetition', f"8x200m at {paces['repetition']} pace with 200m walk", 4.0),
            (7, 'long', f"Long run at {paces['easy']} pace", 8.0),
        ]
        
        for day, workout_type, description, distance in workouts:
            Workout.objects.create(
                training_plan=plan,
                week=week,
                day=day,
                workout_type=workout_type,
                description=description,
                distance=distance,
                target_pace=paces.get(workout_type, paces['easy'])
            )