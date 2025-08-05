
# calculator/services.py
import math

class VDOTCalculator:
    """Daniels VDOT Calculator Implementation"""
    
    @staticmethod
    def calculate_vdot(time_seconds, distance_meters):
        """Calculate VDOT from race time and distance"""
        velocity = distance_meters / time_seconds  # m/s
        
        # Daniels formula for VDOT
        vdot = -4.6 + 0.182258 * velocity + 0.000104 * velocity * velocity
        return max(30, min(85, round(vdot, 1)))
    
    @staticmethod
    def get_training_paces(vdot):
        """Calculate training paces from VDOT"""
        # Daniels pace calculations (simplified)
        easy_velocity = -0.0053 * vdot + 0.1765
        marathon_velocity = -0.0031 * vdot + 0.2040
        threshold_velocity = -0.0039 * vdot + 0.2560
        interval_velocity = -0.0012 * vdot + 0.2989
        rep_velocity = 0.0010 * vdot + 0.3176
        
        # Convert to pace (seconds per mile)
        easy_pace = 1609.34 / easy_velocity
        marathon_pace = 1609.34 / marathon_velocity
        threshold_pace = 1609.34 / threshold_velocity
        interval_pace = 1609.34 / interval_velocity
        rep_pace = 1609.34 / rep_velocity
        
        return {
            'easy': VDOTCalculator.format_pace(easy_pace),
            'marathon': VDOTCalculator.format_pace(marathon_pace),
            'threshold': VDOTCalculator.format_pace(threshold_pace),
            'interval': VDOTCalculator.format_pace(interval_pace),
            'repetition': VDOTCalculator.format_pace(rep_pace),
        }
    
    @staticmethod
    def format_pace(seconds_per_mile):
        """Format pace as MM:SS"""
        minutes = int(seconds_per_mile // 60)
        seconds = int(seconds_per_mile % 60)
        return f"{minutes}:{seconds:02d}"

class McMillanCalculator:
    """McMillan Running Calculator Implementation"""
    
    @staticmethod
    def calculate_equivalent_times(time_seconds, distance_meters):
        """Calculate equivalent race times using McMillan method"""
        # McMillan pace adjustments based on race distance
        if distance_meters <= 5000:  # 5K or shorter
            easy_adjustment = 1.25
            tempo_adjustment = 0.95
            interval_adjustment = 0.92
        elif distance_meters <= 10000:  # 10K
            easy_adjustment = 1.23
            tempo_adjustment = 0.97
            interval_adjustment = 0.94
        else:  # Half marathon or longer
            easy_adjustment = 1.20
            tempo_adjustment = 1.00
            interval_adjustment = 0.96
            
        return {
            'easy': McMillanCalculator.format_pace(pace_per_mile * easy_adjustment),
            'marathon': McMillanCalculator.format_pace(pace_per_mile * 1.05),
            'threshold': McMillanCalculator.format_pace(pace_per_mile * tempo_adjustment),
            'interval': McMillanCalculator.format_pace(pace_per_mile * interval_adjustment),
            'repetition': McMillanCalculator.format_pace(pace_per_mile * 0.90),
        }
    
    @staticmethod
    def format_pace(seconds_per_mile):
        """Format pace as MM:SS"""
        minutes = int(seconds_per_mile // 60)
        seconds = int(seconds_per_mile % 60)
        return f"{minutes}:{seconds:02d}"

class RiegelCalculator:
    """Peter Riegel's Formula Implementation"""
    
    @staticmethod
    def predict_time(known_time, known_distance, target_distance):
        """Predict race time using Riegel formula: T2 = T1 * (D2/D1)^1.06"""
        return known_time * (target_distance / known_distance) ** 1.06
    
    @staticmethod
    def calculate_fitness_factor(time_seconds, distance_meters):
        """Calculate relative fitness factor"""
        # Normalize to 10K equivalent
        standard_distance = 10000
        standard_time = RiegelCalculator.predict_time(time_seconds, distance_meters, standard_distance)
        
        # World record 10K is approximately 1560 seconds (26:00)
        world_record_10k = 1560
        fitness_factor = world_record_10k / standard_time * 100
        
        return min(100, max(30, fitness_factor))
    
    @staticmethod
    def get_training_paces(time_seconds, distance_meters):
        """Calculate training paces using Riegel method"""
        fitness_factor = RiegelCalculator.calculate_fitness_factor(time_seconds, distance_meters)
        
        # Base pace calculations
        base_pace = time_seconds / (distance_meters * 0.000621371)  # seconds per mile
        
        # Riegel training pace multipliers
        easy_multiplier = 1.20 + (100 - fitness_factor) * 0.002
        marathon_multiplier = 1.05 + (100 - fitness_factor) * 0.001
        threshold_multiplier = 0.98 + (100 - fitness_factor) * 0.001
        interval_multiplier = 0.92 + (100 - fitness_factor) * 0.001
        rep_multiplier = 0.88 + (100 - fitness_factor) * 0.001
        
        return {
            'easy': RiegelCalculator.format_pace(base_pace * easy_multiplier),
            'marathon': RiegelCalculator.format_pace(base_pace * marathon_multiplier),
            'threshold': RiegelCalculator.format_pace(base_pace * threshold_multiplier),
            'interval': RiegelCalculator.format_pace(base_pace * interval_multiplier),
            'repetition': RiegelCalculator.format_pace(base_pace * rep_multiplier),
        }
    
    @staticmethod
    def format_pace(seconds_per_mile):
        """Format pace as MM:SS"""
        minutes = int(seconds_per_mile // 60)
        seconds = int(seconds_per_mile % 60)
        return f"{minutes}:{seconds:02d}"