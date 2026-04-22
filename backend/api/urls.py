from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    ActivityLogViewSet,
    CustomerViewSet,
    DashboardView,
    DealViewSet,
    EmployeeViewSet,
    ExpenseViewSet,
    LoginView,
    NotificationViewSet,
    OrderViewSet,
    ProductViewSet,
    ProjectViewSet,
    PurchaseOrderViewSet,
    SubscriptionViewSet,
    SupplierViewSet,
    TaskViewSet,
    UserViewSet,
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'deals', DealViewSet)
router.register(r'expenses', ExpenseViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'suppliers', SupplierViewSet)
router.register(r'purchase-orders', PurchaseOrderViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'subscriptions', SubscriptionViewSet)
router.register(r'activities', ActivityLogViewSet)
router.register(r'notifications', NotificationViewSet)

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('dashboard/metrics/', DashboardView.as_view(), name='dashboard-metrics'),
    path('', include(router.urls)),
]
