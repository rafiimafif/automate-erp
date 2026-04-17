from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import Product, Customer, Order, OrderItem, Deal, Expense, Employee, Supplier
from decimal import Decimal
import secrets
import random
secure_random = random.SystemRandom()

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with initial data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # 1. Create Admin User
        admin_email = 'admin@automate.erp'
        if not User.objects.filter(email=admin_email).exists():
            User.objects.create_superuser(
                email=admin_email,
                password='admin123',
                first_name='Admin',
                last_name='User',
                role='admin'
            )
            self.stdout.write(self.style.SUCCESS(f'Created admin user: {admin_email}'))

        # 2. Seed Products
        if Product.objects.count() == 0:
            products = [
                {'name': 'Wireless Bluetooth Headphones', 'sku': 'AUDIO-WH-01', 'category': 'Electronics', 'unit_price': 129.99, 'stock_quantity': 45},
                {'name': 'Ergonomic Office Chair', 'sku': 'FURN-EOC-02', 'category': 'Furniture', 'unit_price': 249.00, 'stock_quantity': 12},
                {'name': 'Mechanical Keyboard', 'sku': 'COMP-MK-03', 'category': 'Electronics', 'unit_price': 89.50, 'stock_quantity': 0},
                {'name': 'Ceramic Coffee Mug Set', 'sku': 'HOME-CM-04', 'category': 'Home Goods', 'unit_price': 24.99, 'stock_quantity': 156},
                {'name': 'USB-C Fast Charging Cable', 'sku': 'ELEC-CBL-05', 'category': 'Electronics', 'unit_price': 14.99, 'stock_quantity': 89},
            ]
            for p_data in products:
                Product.objects.create(**p_data)
            self.stdout.write(self.style.SUCCESS(f'Created {len(products)} products'))

        # 3. Seed Customers
        if Customer.objects.count() == 0:
            customers = [
                {'name': 'Acme Corp', 'email': 'billing@acme.com', 'company': 'Acme Corporation', 'total_value': 12500.00},
                {'name': 'Stark Industries', 'email': 'tony@stark.com', 'company': 'Stark Industries', 'total_value': 45000.00},
                {'name': 'Wayne Enterprises', 'email': 'bruce@wayne.com', 'company': 'Wayne Enterprises', 'total_value': 32000.00},
            ]
            for c_data in customers:
                Customer.objects.create(**c_data)
            self.stdout.write(self.style.SUCCESS(f'Created {len(customers)} customers'))

        # 4. Seed Orders (Invoices)
        if Order.objects.count() == 0:
            customers = Customer.objects.all()
            for i in range(5):
                cust = secrets.choice(customers)
                order = Order.objects.create(
                    customer=cust,
                    customer_name=cust.name,
                    customer_email=cust.email,
                    status=secrets.choice(['paid', 'pending', 'overdue']),
                    total_amount=Decimal(secure_random.randint(100, 5000))
                )
            self.stdout.write(self.style.SUCCESS('Created initial orders'))

        # 5. Seed Deals (Sales Pipeline)
        if Deal.objects.count() == 0:
            customers = Customer.objects.all()
            stages = ['lead', 'contacted', 'negotiating', 'won']
            deal_titles = ['Enterprise Software License', 'Cloud Infrastructure Setup', 'Hardware Refresh']
            for title in deal_titles:
                Deal.objects.create(
                    title=title,
                    customer=secrets.choice(customers),
                    stage=secrets.choice(stages),
                    value=Decimal(secure_random.randint(5000, 50000)),
                    owner='Rafii'
                )
            self.stdout.write(self.style.SUCCESS('Created initial deals'))

        # 6. Seed Expenses
        if Expense.objects.count() == 0:
            expenses = [
                {'title': 'Travel to Client Site', 'amount': 450.00, 'category': 'Travel', 'status': 'pending', 'submitted_by': 'John Doe'},
                {'title': 'SaaS Subscriptions', 'amount': 120.00, 'category': 'Software', 'status': 'approved', 'submitted_by': 'Jane Smith'},
                {'title': 'Office Supplies', 'amount': 85.50, 'category': 'Other', 'status': 'pending', 'submitted_by': 'John Doe'},
            ]
            for e_data in expenses:
                Expense.objects.create(**e_data)
            self.stdout.write(self.style.SUCCESS('Created initial expenses'))

        # 7. Seed Employees (HR)
        if Employee.objects.count() == 0:
            employees = [
                {'name': 'John Doe', 'email': 'john@automate.erp', 'department': 'Engineering', 'role': 'Senior Developer', 'salary': 120000, 'status': 'active'},
                {'name': 'Jane Smith', 'email': 'jane@automate.erp', 'department': 'Sales', 'role': 'Account Executive', 'salary': 95000, 'status': 'active'},
                {'name': 'Alice Wong', 'email': 'alice@automate.erp', 'department': 'HR', 'role': 'HR Manager', 'salary': 85000, 'status': 'active'},
            ]
            for emp_data in employees:
                Employee.objects.create(**emp_data)
            self.stdout.write(self.style.SUCCESS('Created initial employees'))

        # 8. Seed Suppliers
        if Supplier.objects.count() == 0:
            suppliers = [
                {'name': 'Tech Wholesale Ltd', 'contact_email': 'sales@techwholesale.com', 'phone': '+1-555-0199', 'country': 'USA'},
                {'name': 'Global Furniture Co', 'contact_email': 'orders@globalfurniture.com', 'phone': '+44-20-7946-0958', 'country': 'UK'},
            ]
            for s_data in suppliers:
                Supplier.objects.create(**s_data)
            self.stdout.write(self.style.SUCCESS('Created initial suppliers'))

        self.stdout.write(self.style.SUCCESS('Database seeding completed successfully!'))
