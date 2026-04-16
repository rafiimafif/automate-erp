from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from .models import User, Product, Order, ActivityLog, Notification
from .serializers import (UserSerializer, LoginSerializer, ProductSerializer,
                          OrderSerializer, ActivityLogSerializer, NotificationSerializer)

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

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def perform_create(self, serializer):
        product = serializer.save()
        ActivityLog.objects.create(user=self.request.user, action=f"Created product: {product.name}")

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def perform_create(self, serializer):
        order = serializer.save()
        ActivityLog.objects.create(user=self.request.user, action=f"Created order for {order.customer_name}")
        Notification.objects.create(user=self.request.user, message=f"New order # {order.id} was placed.")

class DashboardView(generics.GenericAPIView):
    def get(self, request):
        total_sales = sum(order.total_amount for order in Order.objects.all())
        active_orders = Order.objects.exclude(status='shipped').count()
        low_stock = Product.objects.filter(stock_quantity__lt=10).count()
        
        return Response({
            "total_sales": total_sales,
            "active_orders": active_orders,
            "low_stock_alerts": low_stock
        })

class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityLog.objects.all().order_by('-timestamp')
    serializer_class = ActivityLogSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-timestamp')
    serializer_class = NotificationSerializer
