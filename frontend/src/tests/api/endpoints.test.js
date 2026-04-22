import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../../api/endpoints';
import { apiClient } from '../../api/client';

// Mock the apiClient
vi.mock('../../api/client', () => ({
  apiClient: vi.fn()
}));

describe('API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls auth endpoints', async () => {
    await api.auth.login({ username: 'u', password: 'p' });
    expect(apiClient).toHaveBeenCalledWith('/auth/login/', expect.objectContaining({ method: 'POST' }));
  });

  it('calls dashboard endpoints', async () => {
    await api.dashboard.metrics();
    expect(apiClient).toHaveBeenCalledWith('/dashboard/metrics/');
  });

  it('calls products endpoints', async () => {
    await api.products.list();
    await api.products.create({});
    await api.products.update(1, {});
    await api.products.delete(1);
    expect(apiClient).toHaveBeenCalledWith('/products/');
    expect(apiClient).toHaveBeenCalledWith('/products/', expect.objectContaining({ method: 'POST' }));
    expect(apiClient).toHaveBeenCalledWith('/products/1/', expect.objectContaining({ method: 'PUT' }));
    expect(apiClient).toHaveBeenCalledWith('/products/1/', expect.objectContaining({ method: 'DELETE' }));
  });

  it('calls customers endpoints', async () => {
    await api.customers.list();
    await api.customers.create({});
    await api.customers.update(1, {});
    await api.customers.delete(1);
    expect(apiClient).toHaveBeenCalledWith('/customers/');
  });

  it('calls orders endpoints', async () => {
    await api.orders.list();
    await api.orders.create({});
    await api.orders.update(1, {});
    await api.orders.delete(1);
    expect(apiClient).toHaveBeenCalledWith('/orders/');
  });

  it('calls deals endpoints', async () => {
    await api.deals.list();
    await api.deals.create({});
    await api.deals.update(1, {});
    await api.deals.delete(1);
    await api.deals.moveStage(1, 'won');
    expect(apiClient).toHaveBeenCalledWith('/deals/1/move_stage/', expect.objectContaining({ method: 'PATCH' }));
  });

  it('calls expenses endpoints', async () => {
    await api.expenses.list();
    await api.expenses.create({});
    await api.expenses.approve(1);
    await api.expenses.reject(1);
    await api.expenses.delete(1);
    expect(apiClient).toHaveBeenCalledWith('/expenses/1/approve/', expect.objectContaining({ method: 'PATCH' }));
  });

  it('calls employees endpoints', async () => {
    await api.employees.list();
    await api.employees.create({});
    await api.employees.update(1, {});
    await api.employees.delete(1);
    expect(apiClient).toHaveBeenCalledWith('/employees/');
  });

  it('calls suppliers and PO endpoints', async () => {
    await api.suppliers.list();
    await api.suppliers.create({});
    await api.suppliers.update(1, {});
    await api.suppliers.delete(1);
    await api.purchaseOrders.list();
    await api.purchaseOrders.create({});
    expect(apiClient).toHaveBeenCalledWith('/suppliers/');
    expect(apiClient).toHaveBeenCalledWith('/purchase-orders/');
  });

  it('calls projects and tasks endpoints', async () => {
    await api.projects.list();
    await api.projects.create({});
    await api.projects.update(1, {});
    await api.projects.delete(1);
    await api.tasks.list(123);
    await api.tasks.create({});
    await api.tasks.update(1, {});
    await api.tasks.delete(1);
    expect(apiClient).toHaveBeenCalledWith('/projects/');
    expect(apiClient).toHaveBeenCalledWith('/tasks/?project=123');
  });

  it('calls activities and notifications', async () => {
    await api.activities.list();
    await api.notifications.list();
    await api.notifications.markRead(1);
    expect(apiClient).toHaveBeenCalledWith('/activities/');
    expect(apiClient).toHaveBeenCalledWith('/notifications/1/', expect.objectContaining({ method: 'PATCH' }));
  });

  it('calls stats endpoints', async () => {
    await api.stats.summary();
    expect(apiClient).toHaveBeenCalledWith('/stats/summary/');
  });

  it('calls subscription endpoints', async () => {
    await api.subscriptions.list();
    await api.subscriptions.create({});
    await api.subscriptions.update(1, {});
    await api.subscriptions.delete(1);
    expect(apiClient).toHaveBeenCalledWith('/subscriptions/1/', expect.objectContaining({ method: 'PUT' }));
  });
});
