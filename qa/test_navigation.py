"""
What is this for:
Tests the application's navigation systems, such as moving between apps via the Home grid 
and navigating within an app using the sidebar.
"""
import pytest
from pages.home_page import HomePage
from pages.inventory_page import InventoryPage

def test_sidebar_navigation(page, base_url, login_helper):
    """Verify that clicking sidebar links updates the current view."""
    login_helper()
    
    home_page = HomePage(page)
    assert home_page.is_welcome_displayed()
    
    home_page.click_inventory()
    
    inventory_page = InventoryPage(page)
    inventory_page.click_sales_and_invoices()
    
    assert "Sales & Invoices" in inventory_page.get_header_title()

def test_app_launcher_to_inventory(page, base_url, login_helper):
    """Verify that opening an app from the Home grid works."""
    login_helper()
    
    home_page = HomePage(page)
    home_page.click_inventory()
    
    inventory_page = InventoryPage(page)
    assert inventory_page.is_loaded()
    
    inventory_page.go_back_home()
    assert home_page.is_welcome_displayed()
