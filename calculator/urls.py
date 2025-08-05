
# calculator/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('calculate/', views.calculate_paces, name='calculate_paces'),
]