from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('profile/create/', views.create_profile, name='create_profile'),
    path('profile/<str:email>/', views.profile_detail, name='profile_detail'),
] 