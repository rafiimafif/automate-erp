from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (LoginView, UserViewSet, ProductViewSet, OrderViewSet,
                    DashboardView, ActivityLogViewSet, NotificationViewSet)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'activities', ActivityLogViewSet)
router.register(r'notifications', NotificationViewSet)

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('dashboard/metrics/', DashboardView.as_view(), name='dashboard-metrics'),
    path('', include(router.urls)),
]
