# blog/views.py
from django.shortcuts import get_object_or_404
from django.db.models import Q, F
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Category, Article, ArticleTag, Newsletter
from .serializers import (CategorySerializer, ArticleListSerializer, 
                         ArticleDetailSerializer, ArticleTagSerializer, 
                         NewsletterSerializer)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Blog categories"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    """Blog articles"""
    queryset = Article.objects.filter(status='published')
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    
    def get_queryset(self):
        queryset = super().get_queryset().select_related(
            'author', 'category'
        ).prefetch_related('tags')
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__slug=category)
        
        # Filter by tag
        tag = self.request.query_params.get('tag', None)
        if tag:
            queryset = queryset.filter(tags__slug=tag)
        
        # Search functionality
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(content__icontains=search) |
                Q(keywords__icontains=search)
            )
        
        return queryset.distinct()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ArticleDetailSerializer
        return ArticleListSerializer
    
    def retrieve(self, request, *args, **kwargs):
        """Get article detail and increment view count"""
        instance = self.get_object()
        # Increment view count
        Article.objects.filter(id=instance.id).update(view_count=F('view_count') + 1)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured articles"""
        featured_articles = self.get_queryset().filter(is_featured=True)[:6]
        serializer = self.get_serializer(featured_articles, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get most popular articles"""
        popular_articles = self.get_queryset().order_by('-view_count')[:10]
        serializer = self.get_serializer(popular_articles, many=True)
        return Response(serializer.data)

class ArticleTagViewSet(viewsets.ReadOnlyModelViewSet):
    """Article tags"""
    queryset = ArticleTag.objects.all()
    serializer_class = ArticleTagSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

class NewsletterViewSet(viewsets.ViewSet):
    """Newsletter subscription"""
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def subscribe(self, request):
        """Subscribe to newsletter"""
        serializer = NewsletterSerializer(data=request.data)
        if serializer.is_valid():
            newsletter = serializer.save()
            if newsletter:
                return Response(
                    {'message': 'Successfully subscribed to newsletter!'}, 
                    status=status.HTTP_201_CREATED
                )
            return Response(
                {'message': 'You are already subscribed!'}, 
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
