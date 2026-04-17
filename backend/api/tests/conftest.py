import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from mixer.backend.django import mixer

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def admin_user(db):
    return mixer.blend(User, role='admin', is_superuser=True, is_staff=True)

@pytest.fixture
def auth_client(api_client, admin_user):
    api_client.force_authenticate(user=admin_user)
    return api_client
