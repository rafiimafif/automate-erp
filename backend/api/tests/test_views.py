import pytest
from django.urls import reverse
from mixer.backend.django import mixer
from rest_framework import status

from api.models import Customer, Deal, Employee, Expense, Product, Project, Subscription, Supplier, Task


@pytest.mark.django_db
class TestProductViews:
    def test_get_products_list(self, auth_client):
        mixer.cycle(5).blend(Product)
        url = reverse('product-list')
        response = auth_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 5

    def test_create_product(self, auth_client):
        url = reverse('product-list')
        data = {
            "name": "Test Product",
            "sku": "TP123",
            "unit_price": "99.99",
            "stock_quantity": 10
        }
        response = auth_client.post(url, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert Product.objects.count() == 1

@pytest.mark.django_db
class TestRemainingViews:
    def test_deal_move_stage(self, auth_client):
        deal = mixer.blend(Deal, stage='lead')
        url = reverse('deal-move-stage', kwargs={'pk': deal.id})
        response = auth_client.patch(url, {'stage': 'contacted'})
        assert response.status_code == status.HTTP_200_OK
        deal.refresh_from_db()
        assert deal.stage == 'contacted'

    def test_expense_list(self, auth_client):
        mixer.cycle(2).blend(Expense)
        response = auth_client.get(reverse('expense-list'))
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2

    def test_employee_list(self, auth_client):
        mixer.cycle(2).blend(Employee)
        response = auth_client.get(reverse('employee-list'))
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2

    def test_supplier_list(self, auth_client):
        mixer.cycle(2).blend(Supplier)
        response = auth_client.get(reverse('supplier-list'))
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2

    def test_project_list(self, auth_client):
        mixer.cycle(2).blend(Project)
        response = auth_client.get(reverse('project-list'))
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2

    def test_task_list(self, auth_client):
        mixer.cycle(2).blend(Task)
        response = auth_client.get(reverse('task-list'))
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2

    def test_subscription_list(self, auth_client):
        mixer.cycle(2).blend(Subscription)
        response = auth_client.get(reverse('subscription-list'))
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2

@pytest.mark.django_db
class TestCustomerViews:
    def test_get_customers_list(self, auth_client):
        mixer.cycle(3).blend(Customer)
        url = reverse('customer-list')
        response = auth_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 3
