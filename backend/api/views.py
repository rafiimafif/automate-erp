from django.db.models import Sum
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    ActivityLog,
    Customer,
    Deal,
    Employee,
    Expense,
    Notification,
    Order,
    Product,
    Project,
    PurchaseOrder,
    Subscription,
    Supplier,
    Task,
    User,
)
from .serializers import (
    ActivityLogSerializer,
    CustomerSerializer,
    DealSerializer,
    EmployeeSerializer,
    ExpenseSerializer,
    LoginSerializer,
    NotificationSerializer,
    OrderSerializer,
    ProductSerializer,
    ProjectSerializer,
    PurchaseOrderSerializer,
    SubscriptionSerializer,
    SupplierSerializer,
    TaskSerializer,
    UserSerializer,
)


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


# ─── Inventory ───────────────────────────────────────────
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        product = serializer.save()
        ActivityLog.objects.create(
            user=self.request.user,
            action=f"Created product: {product.name}"
        )

    def perform_destroy(self, instance):
        name = instance.name
        instance.delete()
        ActivityLog.objects.create(
            user=self.request.user,
            action=f"Deleted product: {name}"
        )


# ─── Customers / CRM ─────────────────────────────────────
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all().order_by('-created_at')
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        customer = serializer.save()
        ActivityLog.objects.create(
            user=self.request.user,
            action=f"Added customer: {customer.name}"
        )


# ─── Sales / Orders ──────────────────────────────────────
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        order = serializer.save()
        ActivityLog.objects.create(
            user=self.request.user,
            action=f"Created invoice #{order.id} for {order.customer_name}"
        )


# ─── Pipeline / Deals ────────────────────────────────────
class DealViewSet(viewsets.ModelViewSet):
    queryset = Deal.objects.all().order_by('-created_at')
    serializer_class = DealSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['patch'])
    def move_stage(self, request, pk=None):
        deal = self.get_object()
        new_stage = request.data.get('stage')
        if new_stage not in dict(Deal.STAGE_CHOICES):
            return Response({'error': 'Invalid stage'}, status=400)
        deal.stage = new_stage
        deal.save()
        ActivityLog.objects.create(
            user=request.user,
            action=f"Moved deal '{deal.title}' to stage: {new_stage}"
        )
        return Response(DealSerializer(deal).data)


# ─── Expenses ────────────────────────────────────────────
class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all().order_by('-submitted_at')
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        expense = self.get_object()
        expense.status = 'approved'
        expense.save()
        ActivityLog.objects.create(
            user=request.user,
            action=f"Approved expense: {expense.title}"
        )
        return Response(ExpenseSerializer(expense).data)

    @action(detail=True, methods=['patch'])
    def reject(self, request, pk=None):
        expense = self.get_object()
        expense.status = 'rejected'
        expense.save()
        ActivityLog.objects.create(
            user=request.user,
            action=f"Rejected expense: {expense.title}"
        )
        return Response(ExpenseSerializer(expense).data)


# ─── HR / Employees ──────────────────────────────────────
class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all().order_by('name')
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.IsAuthenticated]


# ─── Suppliers & POs ─────────────────────────────────────
class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all().order_by('-created_at')
    serializer_class = SupplierSerializer
    permission_classes = [permissions.IsAuthenticated]


class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all().order_by('-order_date')
    serializer_class = PurchaseOrderSerializer
    permission_classes = [permissions.IsAuthenticated]


# ─── Projects & Tasks ────────────────────────────────────
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('-created_at')
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        project_id = self.request.query_params.get('project')
        if project_id:
            qs = qs.filter(project_id=project_id)
        return qs


# ─── Subscriptions ──────────────────────────────────────
class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all().order_by('-created_at')
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]


# ─── Dashboard Metrics ───────────────────────────────────
class DashboardView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total_sales = Order.objects.aggregate(total=Sum('total_amount'))['total'] or 0
        total_orders = Order.objects.count()
        total_customers = Customer.objects.count()
        low_stock = Product.objects.filter(stock_quantity__lt=20).count()
        active_deals = Deal.objects.exclude(stage__in=['won', 'lost']).count()
        pending_expenses = Expense.objects.filter(status='pending').count()

        recent_activity = ActivityLog.objects.order_by('-timestamp')[:10].values(
            'action', 'timestamp'
        )

        return Response({
            "total_sales": float(total_sales),
            "total_orders": total_orders,
            "total_customers": total_customers,
            "low_stock_alerts": low_stock,
            "active_deals": active_deals,
            "pending_expenses": pending_expenses,
            "recent_activity": list(recent_activity),
        })


# ─── System ──────────────────────────────────────────────
class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityLog.objects.all().order_by('-timestamp')
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-timestamp')
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
