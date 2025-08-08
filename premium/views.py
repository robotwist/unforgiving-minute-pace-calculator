# premium/views.py
from django.shortcuts import get_object_or_404
from django.db.models import Q, F
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import PremiumTrainingPlan, PlanTestimonial, PurchasedPlan, PlanCategory
from .serializers import (PremiumTrainingPlanListSerializer, PremiumTrainingPlanDetailSerializer,
                         PlanTestimonialSerializer, PurchasedPlanSerializer, PlanCategorySerializer)

class PlanCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Premium plan categories"""
    queryset = PlanCategory.objects.all()
    serializer_class = PlanCategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

class PremiumTrainingPlanViewSet(viewsets.ReadOnlyModelViewSet):
    """Premium training plans"""
    queryset = PremiumTrainingPlan.objects.filter(is_active=True)
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    
    def get_queryset(self):
        queryset = super().get_queryset().select_related(
            'author'
        ).prefetch_related('categories', 'testimonials')
        
        # Filter by distance
        distance = self.request.query_params.get('distance', None)
        if distance:
            queryset = queryset.filter(distance=distance)
        
        # Filter by difficulty
        difficulty = self.request.query_params.get('difficulty', None)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        
        # Filter by plan type
        plan_type = self.request.query_params.get('plan_type', None)
        if plan_type:
            queryset = queryset.filter(plan_type=plan_type)
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(categories__slug=category)
        
        # Search functionality
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(key_features__icontains=search)
            )
        
        return queryset.distinct()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PremiumTrainingPlanDetailSerializer
        return PremiumTrainingPlanListSerializer
    
    def retrieve(self, request, *args, **kwargs):
        """Get plan detail and increment view count"""
        instance = self.get_object()
        # Increment view count
        PremiumTrainingPlan.objects.filter(id=instance.id).update(view_count=F('view_count') + 1)
        serializer = self.get_serializer(instance, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured plans"""
        featured_plans = self.get_queryset().filter(is_featured=True)[:6]
        serializer = self.get_serializer(featured_plans, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get most popular plans"""
        popular_plans = self.get_queryset().order_by('-purchase_count', '-view_count')[:10]
        serializer = self.get_serializer(popular_plans, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def on_sale(self, request):
        """Get plans on sale"""
        sale_plans = self.get_queryset().filter(is_on_sale=True)
        serializer = self.get_serializer(sale_plans, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def purchase(self, request, slug=None):
        """Purchase a premium plan"""
        plan = self.get_object()
        user = request.user
        
        # Check if already purchased
        if PurchasedPlan.objects.filter(user=user, plan=plan).exists():
            return Response(
                {'error': 'You have already purchased this plan'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Here you would integrate with your payment processor
        # For now, we'll create a purchase record
        purchase = PurchasedPlan.objects.create(
            user=user,
            plan=plan,
            purchase_price=plan.current_price,
            payment_status='completed'
        )
        
        # Update plan purchase count
        PremiumTrainingPlan.objects.filter(id=plan.id).update(
            purchase_count=F('purchase_count') + 1
        )
        
        serializer = PurchasedPlanSerializer(purchase)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class PurchasedPlanViewSet(viewsets.ReadOnlyModelViewSet):
    """User's purchased plans"""
    serializer_class = PurchasedPlanSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return PurchasedPlan.objects.filter(
            user=self.request.user,
            access_granted=True
        ).select_related('plan')
    
    @action(detail=True, methods=['post'])
    def download(self, request, pk=None):
        """Track plan downloads"""
        purchase = self.get_object()
        
        # Increment download count
        PurchasedPlan.objects.filter(id=purchase.id).update(
            download_count=F('download_count') + 1
        )
        
        # Return download URLs
        return Response({
            'pdf_url': purchase.plan.pdf_url,
            'spreadsheet_url': purchase.plan.spreadsheet_url,
            'bonus_content': purchase.plan.bonus_content,
        })

class PlanTestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    """Plan testimonials"""
    queryset = PlanTestimonial.objects.filter(is_featured=True)
    serializer_class = PlanTestimonialSerializer
    permission_classes = [AllowAny]
