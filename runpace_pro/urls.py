# urls.py configurations
# runpace_pro/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/calculator/', include('calculator.urls')),
    path('api/training/', include('training.urls')),
    path('api/plans/', include('plans.urls')),
    path('api/blog/', include('blog.urls')),
    path('api/premium/', include('premium.urls')),
]
