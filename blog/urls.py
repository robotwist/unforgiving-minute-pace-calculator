# blog/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'blog'

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'articles', views.ArticleViewSet)
router.register(r'tags', views.ArticleTagViewSet)
router.register(r'newsletter', views.NewsletterViewSet, basename='newsletter')

urlpatterns = [
    path('', include(router.urls)),
]
