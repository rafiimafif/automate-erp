import { apiClient } from './client';

export const api = {
  auth: {
    login: (credentials) => apiClient('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
  },
  
  dashboard: {
    metrics: () => apiClient('/dashboard/metrics/'),
  },

  products: {
    list: () => apiClient('/products/'),
    create: (data) => apiClient('/products/', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => apiClient(`/products/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => apiClient(`/products/${id}/`, {
      method: 'DELETE'
    }),
  },

  customers: {
    list: () => apiClient('/customers/'),
    create: (data) => apiClient('/customers/', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => apiClient(`/customers/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => apiClient(`/customers/${id}/`, {
      method: 'DELETE'
    }),
  },

  orders: {
    list: () => apiClient('/orders/'),
    create: (data) => apiClient('/orders/', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => apiClient(`/orders/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => apiClient(`/orders/${id}/`, {
      method: 'DELETE'
    }),
  },

  deals: {
    list: () => apiClient('/deals/'),
    create: (data) => apiClient('/deals/', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => apiClient(`/deals/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => apiClient(`/deals/${id}/`, {
      method: 'DELETE'
    }),
    moveStage: (id, stage) => apiClient(`/deals/${id}/move_stage/`, {
      method: 'PATCH',
      body: JSON.stringify({ stage })
    }),
  },

  expenses: {
    list: () => apiClient('/expenses/'),
    create: (data) => apiClient('/expenses/', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    approve: (id) => apiClient(`/expenses/${id}/approve/`, {
      method: 'PATCH'
    }),
    reject: (id) => apiClient(`/expenses/${id}/reject/`, {
      method: 'PATCH'
    }),
    delete: (id) => apiClient(`/expenses/${id}/`, {
      method: 'DELETE'
    }),
  },

  employees: {
    list: () => apiClient('/employees/'),
    create: (data) => apiClient('/employees/', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => apiClient(`/employees/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => apiClient(`/employees/${id}/`, {
      method: 'DELETE'
    }),
  },

  suppliers: {
    list: () => apiClient('/suppliers/'),
    create: (data) => apiClient('/suppliers/', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => apiClient(`/suppliers/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => apiClient(`/suppliers/${id}/`, {
      method: 'DELETE'
    }),
  },

  purchaseOrders: {
    list: () => apiClient('/purchase-orders/'),
    create: (data) => apiClient('/purchase-orders/', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  },

  projects: {
    list: () => apiClient('/projects/'),
    create: (data) => apiClient('/projects/', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => apiClient(`/projects/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => apiClient(`/projects/${id}/`, {
      method: 'DELETE'
    }),
  },

  tasks: {
    list: (projectId) => apiClient(`/tasks/${projectId ? `?project=${projectId}` : ''}`),
    create: (data) => apiClient('/tasks/', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => apiClient(`/tasks/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => apiClient(`/tasks/${id}/`, {
      method: 'DELETE'
    }),
  },

  activities: {
    list: () => apiClient('/activities/'),
  },

  notifications: {
    list: () => apiClient('/notifications/'),
    markRead: (id) => apiClient(`/notifications/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ is_read: true })
    }),
  }
};
