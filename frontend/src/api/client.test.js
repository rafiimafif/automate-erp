import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from './client';

describe('apiClient', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    localStorage.clear();
    // Mock location.reload
    vi.stubGlobal('location', { reload: vi.fn() });
  });

  it('adds Authorization header when token exists', async () => {
    localStorage.setItem('access_token', 'test-token');
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: 'success' }),
      status: 200
    });

    await apiClient('/test');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-token'
        })
      })
    );
  });

  it('clears storage and reloads on 401', async () => {
    localStorage.setItem('access_token', 'expired-token');
    global.fetch.mockResolvedValue({
      ok: false,
      status: 401
    });

    await apiClient('/test');

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('throws error on non-ok response', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ detail: 'Server Error' })
    });

    await expect(apiClient('/test')).rejects.toThrow('Server Error');
  });

  it('returns true on 204 No Content', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 204
    });

    const result = await apiClient('/test');
    expect(result).toBe(true);
  });
});
