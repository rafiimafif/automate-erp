from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import (
    User, Product, Order, OrderItem, ActivityLog, Notification,
    Customer, Deal, Expense, Employee, Supplier, PurchaseOrder, Project, Task, Subscription
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'role', 'first_name', 'last_name')


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data['username'], password=data['password'])
        if user and user.is_active:
            refresh = RefreshToken.for_user(user)
            return {
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }
        raise serializers.ValidationError("Incorrect credentials. Please try again.")


# ─── Inventory ───────────────────────────────────────────
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ('status', 'created_at', 'updated_at')


# ─── Customers ───────────────────────────────────────────
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'
        read_only_fields = ('created_at',)


# ─── Sales / Orders ──────────────────────────────────────
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'quantity', 'price')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, required=False)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('created_at',)

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order


# ─── Subscriptions ───────────────────────────────────────────
class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = '__all__'


# ─── Pipeline / Deals ────────────────────────────────────
class DealSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Deal
        fields = '__all__'
        read_only_fields = ('created_at',)

    def get_customer_name(self, obj):
        return obj.customer.name if obj.customer else ''


# ─── Expenses ────────────────────────────────────────────
class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ('submitted_at',)


# ─── HR / Employees ──────────────────────────────────────
class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'


# ─── Suppliers & POs ─────────────────────────────────────
class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'
        read_only_fields = ('created_at',)


class PurchaseOrderSerializer(serializers.ModelSerializer):
    supplier_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = '__all__'
        read_only_fields = ('order_date',)

    def get_supplier_name(self, obj):
        return obj.supplier.name if obj.supplier else ''


# ─── Projects & Tasks ────────────────────────────────────
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ('created_at',)


class ProjectSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    task_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ('created_at',)

    def get_task_count(self, obj):
        return obj.tasks.count()


# ─── System ──────────────────────────────────────────────
class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = '__all__'


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
