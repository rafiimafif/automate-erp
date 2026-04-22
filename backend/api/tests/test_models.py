
import pytest
from mixer.backend.django import mixer

from api.models import Customer, Deal, Employee, Expense, Order, Product, Project, PurchaseOrder, Subscription, Supplier, Task


@pytest.mark.django_db
class TestProductModel:
    def test_product_save_status_logic(self):
        # Case 1: In Stock
        p1 = mixer.blend(Product, stock_quantity=50)
        assert p1.status == 'In Stock'

        # Case 2: Low Stock
        p2 = mixer.blend(Product, stock_quantity=10)
        assert p2.status == 'Low Stock'

        # Case 3: Out of Stock
        p3 = mixer.blend(Product, stock_quantity=0)
        assert p3.status == 'Out of Stock'

@pytest.mark.django_db
class TestRemainingModels:
    def test_deal_str(self):
        deal = mixer.blend(Deal, title='Big Deal')
        assert str(deal) == 'Big Deal'

    def test_expense_str(self):
        exp = mixer.blend(Expense, title='Office Rent')
        assert str(exp) == 'Office Rent'

    def test_employee_str(self):
        emp = mixer.blend(Employee, name='Alice')
        assert str(emp) == 'Alice'

    def test_supplier_str(self):
        sup = mixer.blend(Supplier, name='Global Hub')
        assert str(sup) == 'Global Hub'

    def test_po_str(self):
        sup = mixer.blend(Supplier, name='Global Hub')
        po = mixer.blend(PurchaseOrder, supplier=sup)
        assert str(po) == f"PO #{po.id} - Global Hub"

    def test_project_str(self):
        proj = mixer.blend(Project, title='ERP v2')
        assert str(proj) == 'ERP v2'

    def test_task_str(self):
        task = mixer.blend(Task, title='Deploy')
        assert str(task) == 'Deploy'

    def test_subscription_str(self):
        sub = mixer.blend(Subscription, customer='Acme', plan='Enterprise')
        assert str(sub) == 'Acme - Enterprise'

@pytest.mark.django_db
class TestCustomerModel:
    def test_customer_creation(self):
        customer = mixer.blend(Customer, name='Test Corp')
        assert str(customer) == 'Test Corp'
        assert customer.id is not None

@pytest.mark.django_db
class TestOrderModel:
    def test_order_str_representation(self):
        order = mixer.blend(Order, customer_name='John Doe')
        assert str(order) == f"Order #{order.id} - John Doe"
