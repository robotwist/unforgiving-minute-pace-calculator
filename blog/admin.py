# blog/admin.py
from django.contrib import admin
from django.utils import timezone
from .models import Category, Article, ArticleTag, Newsletter

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'status', 'is_featured', 
                   'view_count', 'published_at', 'created_at')
    list_filter = ('status', 'is_featured', 'category', 'created_at', 'published_at')
    search_fields = ('title', 'content', 'keywords')
    prepopulated_fields = {'slug': ('title',)}
    raw_id_fields = ('author',)
    filter_horizontal = ('tags',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'author', 'category', 'status', 'is_featured')
        }),
        ('SEO', {
            'fields': ('meta_description', 'keywords'),
            'classes': ('collapse',)
        }),
        ('Content', {
            'fields': ('excerpt', 'content', 'featured_image')
        }),
        ('Publishing', {
            'fields': ('published_at',)
        }),
        ('Analytics', {
            'fields': ('view_count',),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['publish_articles', 'unpublish_articles', 'feature_articles']
    
    def publish_articles(self, request, queryset):
        updated = queryset.update(status='published', published_at=timezone.now())
        self.message_user(request, f'{updated} articles published.')
    publish_articles.short_description = "Publish selected articles"
    
    def unpublish_articles(self, request, queryset):
        updated = queryset.update(status='draft')
        self.message_user(request, f'{updated} articles unpublished.')
    unpublish_articles.short_description = "Unpublish selected articles"
    
    def feature_articles(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} articles featured.')
    feature_articles.short_description = "Feature selected articles"

@admin.register(ArticleTag)
class ArticleTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'article_count')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)
    
    def article_count(self, obj):
        return obj.articles.count()
    article_count.short_description = 'Articles'

@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_active', 'subscribed_at')
    list_filter = ('is_active', 'subscribed_at')
    search_fields = ('email',)
    readonly_fields = ('subscribed_at',)
    
    actions = ['activate_subscribers', 'deactivate_subscribers']
    
    def activate_subscribers(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} subscribers activated.')
    activate_subscribers.short_description = "Activate selected subscribers"
    
    def deactivate_subscribers(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} subscribers deactivated.')
    deactivate_subscribers.short_description = "Deactivate selected subscribers"
