# premium/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import PremiumTrainingPlan, PlanTestimonial, PurchasedPlan, PlanCategory

@admin.register(PremiumTrainingPlan)
class PremiumTrainingPlanAdmin(admin.ModelAdmin):
    list_display = ('title', 'distance', 'difficulty', 'plan_type', 'current_price_display', 
                   'is_on_sale', 'is_featured', 'purchase_count', 'view_count', 'created_at')
    list_filter = ('distance', 'difficulty', 'plan_type', 'is_active', 'is_featured', 
                  'is_on_sale', 'created_at')
    search_fields = ('title', 'description', 'keywords')
    prepopulated_fields = {'slug': ('title',)}
    raw_id_fields = ('author',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'author', 'distance', 'difficulty', 'plan_type')
        }),
        ('Plan Details', {
            'fields': ('duration_weeks', 'weekly_mileage_range', 'description', 
                      'key_features', 'target_audience', 'prerequisites')
        }),
        ('Training Content', {
            'fields': ('training_philosophy', 'sample_week', 'workout_types', 
                      'progression_strategy'),
            'classes': ('collapse',)
        }),
        ('Pricing', {
            'fields': ('price', 'sale_price', 'is_on_sale')
        }),
        ('Digital Content', {
            'fields': ('pdf_url', 'spreadsheet_url', 'bonus_content'),
            'classes': ('collapse',)
        }),
        ('SEO & Marketing', {
            'fields': ('meta_description', 'keywords', 'featured_image'),
            'classes': ('collapse',)
        }),
        ('Publishing', {
            'fields': ('is_active', 'is_featured')
        }),
        ('Analytics', {
            'fields': ('view_count', 'purchase_count'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['activate_plans', 'deactivate_plans', 'feature_plans', 'put_on_sale']
    
    def current_price_display(self, obj):
        price_html = f"${obj.current_price}"
        if obj.is_on_sale:
            price_html = format_html(
                '<span style="color: red; font-weight: bold;">${} <del>${}</del></span>',
                obj.sale_price, obj.price
            )
        return price_html
    current_price_display.short_description = 'Current Price'
    
    def activate_plans(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} plans activated.')
    activate_plans.short_description = "Activate selected plans"
    
    def deactivate_plans(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} plans deactivated.')
    deactivate_plans.short_description = "Deactivate selected plans"
    
    def feature_plans(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} plans featured.')
    feature_plans.short_description = "Feature selected plans"
    
    def put_on_sale(self, request, queryset):
        updated = queryset.update(is_on_sale=True)
        self.message_user(request, f'{updated} plans put on sale.')
    put_on_sale.short_description = "Put selected plans on sale"

@admin.register(PlanTestimonial)
class PlanTestimonialAdmin(admin.ModelAdmin):
    list_display = ('customer_name', 'plan', 'race_result', 'improvement', 
                   'is_featured', 'created_at')
    list_filter = ('is_featured', 'plan', 'created_at')
    search_fields = ('customer_name', 'testimonial', 'race_result')
    raw_id_fields = ('plan',)
    
    actions = ['feature_testimonials']
    
    def feature_testimonials(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} testimonials featured.')
    feature_testimonials.short_description = "Feature selected testimonials"

@admin.register(PurchasedPlan)
class PurchasedPlanAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan', 'purchase_price', 'purchased_at', 
                   'payment_status', 'access_granted', 'download_count')
    list_filter = ('payment_status', 'access_granted', 'purchased_at', 'plan')
    search_fields = ('user__email', 'plan__title', 'payment_id')
    raw_id_fields = ('user', 'plan')
    readonly_fields = ('purchased_at',)
    
    actions = ['grant_access', 'revoke_access']
    
    def grant_access(self, request, queryset):
        updated = queryset.update(access_granted=True)
        self.message_user(request, f'Access granted for {updated} purchases.')
    grant_access.short_description = "Grant access to selected purchases"
    
    def revoke_access(self, request, queryset):
        updated = queryset.update(access_granted=False)
        self.message_user(request, f'Access revoked for {updated} purchases.')
    revoke_access.short_description = "Revoke access to selected purchases"

@admin.register(PlanCategory)
class PlanCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'plan_count')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')
    filter_horizontal = ('plans',)
    
    def plan_count(self, obj):
        return obj.plans.count()
    plan_count.short_description = 'Plans'
