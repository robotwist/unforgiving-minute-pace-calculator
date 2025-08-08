# blog/serializers.py
from rest_framework import serializers
from .models import Category, Article, ArticleTag, Newsletter

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']

class ArticleTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleTag
        fields = ['id', 'name', 'slug']

class ArticleListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for article lists"""
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    tags = ArticleTagSerializer(many=True, read_only=True)
    read_time = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = ['id', 'title', 'slug', 'author_name', 'category_name', 'tags',
                 'excerpt', 'featured_image', 'published_at', 'view_count', 'read_time']
    
    def get_read_time(self, obj):
        """Estimate reading time based on word count"""
        word_count = len(obj.content.split())
        read_time = max(1, word_count // 200)  # Assuming 200 words per minute
        return f"{read_time} min read"

class ArticleDetailSerializer(serializers.ModelSerializer):
    """Full serializer for article detail view"""
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    category = CategorySerializer(read_only=True)
    tags = ArticleTagSerializer(many=True, read_only=True)
    read_time = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = ['id', 'title', 'slug', 'author_name', 'category', 'tags',
                 'meta_description', 'excerpt', 'content', 'featured_image',
                 'published_at', 'view_count', 'read_time']
    
    def get_read_time(self, obj):
        word_count = len(obj.content.split())
        read_time = max(1, word_count // 200)
        return f"{read_time} min read"

class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter
        fields = ['email']
    
    def create(self, validated_data):
        email = validated_data['email']
        newsletter, created = Newsletter.objects.get_or_create(
            email=email,
            defaults={'is_active': True}
        )
        return newsletter
