# premium/serializers.py
from rest_framework import serializers
from .models import PremiumTrainingPlan, PlanTestimonial, PurchasedPlan, PlanCategory

class PlanCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanCategory
        fields = ['id', 'name', 'slug', 'description']

class PlanTestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanTestimonial
        fields = ['id', 'customer_name', 'customer_location', 'testimonial', 
                 'race_result', 'improvement', 'created_at']

class PremiumTrainingPlanListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for plan listings"""
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    categories = PlanCategorySerializer(many=True, read_only=True)
    testimonial_count = serializers.SerializerMethodField()
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    savings = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    savings_percentage = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = PremiumTrainingPlan
        fields = ['id', 'title', 'slug', 'author_name', 'distance', 'difficulty', 
                 'plan_type', 'duration_weeks', 'weekly_mileage_range', 'description',
                 'key_features', 'target_audience', 'price', 'current_price', 
                 'is_on_sale', 'savings', 'savings_percentage', 'featured_image',
                 'categories', 'testimonial_count', 'purchase_count', 'view_count']
    
    def get_testimonial_count(self, obj):
        return obj.testimonials.filter(is_featured=True).count()

class PremiumTrainingPlanDetailSerializer(serializers.ModelSerializer):
    """Full serializer for plan detail view"""
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    categories = PlanCategorySerializer(many=True, read_only=True)
    testimonials = serializers.SerializerMethodField()
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    savings = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    savings_percentage = serializers.IntegerField(read_only=True)
    is_purchased = serializers.SerializerMethodField()
    
    class Meta:
        model = PremiumTrainingPlan
        fields = ['id', 'title', 'slug', 'author_name', 'distance', 'difficulty', 
                 'plan_type', 'duration_weeks', 'weekly_mileage_range', 'description',
                 'key_features', 'target_audience', 'prerequisites', 'training_philosophy',
                 'sample_week', 'workout_types', 'progression_strategy', 'bonus_content',
                 'price', 'current_price', 'is_on_sale', 'savings', 'savings_percentage',
                 'featured_image', 'categories', 'testimonials', 'purchase_count', 
                 'view_count', 'is_purchased']
    
    def get_testimonials(self, obj):
        featured_testimonials = obj.testimonials.filter(is_featured=True)[:3]
        return PlanTestimonialSerializer(featured_testimonials, many=True).data
    
    def get_is_purchased(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return PurchasedPlan.objects.filter(user=request.user, plan=obj).exists()
        return False

class PurchasedPlanSerializer(serializers.ModelSerializer):
    plan = PremiumTrainingPlanListSerializer(read_only=True)
    
    class Meta:
        model = PurchasedPlan
        fields = ['id', 'plan', 'purchase_price', 'purchased_at', 'access_granted', 
                 'download_count']
