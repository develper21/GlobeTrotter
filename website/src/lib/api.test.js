import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import api from './api';

describe('api client', () => {
  let originalToken;
  let originalUser;

  beforeEach(() => {
    originalToken = localStorage.getItem('token');
    originalUser = localStorage.getItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  });

  afterEach(() => {
    if (originalToken === null) localStorage.removeItem('token');
    else localStorage.setItem('token', originalToken);
    if (originalUser === null) localStorage.removeItem('user');
    else localStorage.setItem('user', originalUser);
  });

  it('is configured withCredentials for auth cookies', () => {
    expect(api.defaults.withCredentials).toBe(true);
  });

  it('attaches Authorization header when token exists in localStorage', () => {
    localStorage.setItem('token', 'test-token-123');
    const interceptor = api.interceptors.request.handlers[0];
    const config = interceptor.fulfilled({ headers: {} });
    expect(config.headers.Authorization).toBe('Bearer test-token-123');
  });

  it('does not attach Authorization header without a token', () => {
    const interceptor = api.interceptors.request.handlers[0];
    const config = interceptor.fulfilled({ headers: {} });
    expect(config.headers.Authorization).toBeUndefined();
  });

  it('clears auth keys on 401 responses', () => {
    localStorage.setItem('token', 'stale-token');
    localStorage.setItem('user', '{"id":1}');
    const interceptor = api.interceptors.response.handlers[0];
    interceptor.rejected({
      response: { status: 401 },
      config: {},
    }).catch(() => {});
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
