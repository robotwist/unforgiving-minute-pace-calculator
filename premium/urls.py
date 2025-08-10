# premium/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'premium'

router = DefaultRouter()
router.register(r'categories', views.PlanCategoryViewSet)
router.register(r'plans', views.PremiumTrainingPlanViewSet)
router.register(r'purchased', views.PurchasedPlanViewSet, basename='purchased')
router.register(r'testimonials', views.PlanTestimonialViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Payment processing endpoints
    path('create-payment-intent/', views.create_payment_intent, name='create-payment-intent'),
]
