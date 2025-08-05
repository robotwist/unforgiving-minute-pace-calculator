from django.contrib import admin
from .models import User, UserProfile

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'is_active', 'date_joined')
    search_fields = ('email', 'username')
    list_filter = ('is_active', 'is_staff', 'date_joined')

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'current_vdot', 'weekly_mileage', 'goal_race_distance')
    list_filter = ('goal_race_distance',)
    search_fields = ('user__username', 'user__email') 