# premium/models.py
from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.urls import reverse
from decimal import Decimal

User = get_user_model()

class PremiumTrainingPlan(models.Model):
    """Premium training plans for purchase"""
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('elite', 'Elite'),
    ]
    
    DISTANCE_CHOICES = [
        ('5k', '5K'),
        ('10k', '10K'),
        ('15k', '15K'),
        ('half_marathon', 'Half Marathon'),
        ('marathon', 'Marathon'),
        ('ultra', 'Ultra Marathon'),
        ('multi', 'Multi-Distance'),
    ]
    
    PLAN_TYPE_CHOICES = [
        ('base', 'Base Building'),
        ('build', 'Build Phase'),
        ('peak', 'Peak/Sharpening'),
        ('full_cycle', 'Full Training Cycle'),
        ('specialty', 'Specialty Program'),
    ]
    
    # Basic Information
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='premium_plans')
    
    # Plan Details
    distance = models.CharField(max_length=20, choices=DISTANCE_CHOICES)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    plan_type = models.CharField(max_length=20, choices=PLAN_TYPE_CHOICES)
    duration_weeks = models.PositiveIntegerField(help_text="Plan duration in weeks")
    weekly_mileage_range = models.CharField(max_length=50, help_text="e.g., '40-60 miles/week'")
    
    # Content
    description = models.TextField(help_text="Detailed plan description")
    key_features = models.TextField(help_text="Bullet points of key features (one per line)")
    target_audience = models.TextField(help_text="Who this plan is designed for")
    prerequisites = models.TextField(blank=True, help_text="Required fitness level or experience")
    
    # Detailed Training Content
    training_philosophy = models.TextField(help_text="The approach and methodology")
    sample_week = models.TextField(help_text="Example training week structure")
    workout_types = models.TextField(help_text="Types of workouts included")
    progression_strategy = models.TextField(help_text="How the plan builds over time")
    
    # Pricing and Sales
    price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                   help_text="Optional sale price")
    is_on_sale = models.BooleanField(default=False)
    
    # Digital Content
    pdf_url = models.URLField(blank=True, help_text="Link to downloadable PDF")
    spreadsheet_url = models.URLField(blank=True, help_text="Link to training log spreadsheet")
    bonus_content = models.TextField(blank=True, help_text="Additional bonus materials included")
    
    # SEO and Marketing
    meta_description = models.CharField(max_length=160, blank=True)
    keywords = models.CharField(max_length=200, blank=True)
    featured_image = models.URLField(blank=True)
    
    # Publishing
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Analytics
    view_count = models.PositiveIntegerField(default=0)
    purchase_count = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['-is_featured', '-created_at']
        indexes = [
            models.Index(fields=['is_active', 'is_featured']),
            models.Index(fields=['distance', 'difficulty']),
            models.Index(fields=['plan_type', 'is_active']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    @property
    def current_price(self):
        """Return the current price (sale price if on sale)"""
        if self.is_on_sale and self.sale_price:
            return self.sale_price
        return self.price
    
    @property
    def savings(self):
        """Return savings amount if on sale"""
        if self.is_on_sale and self.sale_price:
            return self.price - self.sale_price
        return Decimal('0.00')
    
    @property
    def savings_percentage(self):
        """Return savings percentage if on sale"""
        if self.is_on_sale and self.sale_price and self.price > 0:
            return int((self.savings / self.price) * 100)
        return 0
    
    def get_absolute_url(self):
        return reverse('premium:plan_detail', kwargs={'slug': self.slug})
    
    def __str__(self):
        return self.title

class PlanTestimonial(models.Model):
    """Customer testimonials for premium plans"""
    plan = models.ForeignKey(PremiumTrainingPlan, on_delete=models.CASCADE, related_name='testimonials')
    customer_name = models.CharField(max_length=100)
    customer_location = models.CharField(max_length=100, blank=True)
    testimonial = models.TextField()
    race_result = models.CharField(max_length=200, blank=True, help_text="e.g., 'Boston Marathon: 3:15:42'")
    improvement = models.CharField(max_length=200, blank=True, help_text="e.g., '15-minute PR'")
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-is_featured', '-created_at']
    
    def __str__(self):
        return f"{self.customer_name} - {self.plan.title}"

class PurchasedPlan(models.Model):
    """Track purchased plans"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchased_plans')
    plan = models.ForeignKey(PremiumTrainingPlan, on_delete=models.CASCADE, related_name='purchases')
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    purchased_at = models.DateTimeField(auto_now_add=True)
    
    # Payment tracking (integrate with your payment processor)
    payment_id = models.CharField(max_length=100, blank=True)
    payment_status = models.CharField(max_length=50, default='completed')
    
    # Access control
    access_granted = models.BooleanField(default=True)
    download_count = models.PositiveIntegerField(default=0)
    
    class Meta:
        unique_together = ('user', 'plan')
        ordering = ['-purchased_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.plan.title}"

class PlanCategory(models.Model):
    """Categories for organizing premium plans"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    plans = models.ManyToManyField(PremiumTrainingPlan, related_name='categories', blank=True)
    
    class Meta:
        verbose_name_plural = "Plan Categories"
        ordering = ['name']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
