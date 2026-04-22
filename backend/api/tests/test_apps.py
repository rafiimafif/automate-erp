from django.apps import apps

from api.apps import ApiConfig


def test_apps():
    assert ApiConfig.name == 'api'
    assert apps.get_app_config('api').name == 'api'
