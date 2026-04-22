import pytest
from django.core.management import call_command

from api.models import Customer, Deal, Employee, Expense, Order, Product, Supplier


@pytest.mark.django_db
def test_seed_data_command():
    """
    Test that the seed_data command runs without error and creates initial data.
    """
    # Execute the command
    call_command('seed_data')

    # Assert that data was created
    assert Product.objects.count() > 0
    assert Customer.objects.count() > 0
    assert Order.objects.count() > 0
    assert Deal.objects.count() > 0
    assert Expense.objects.count() > 0
    assert Employee.objects.count() > 0
    assert Supplier.objects.count() > 0
