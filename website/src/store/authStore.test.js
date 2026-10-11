import { describe, it, expect, beforeEach, vi } from 'vitest';
import useAuthStore from './authStore';

// Mock the api module so no real network calls happen
vi.mock('../lib/api', () => ({
  default: {
    post: vi.fn(),
    put: vi.fn(),
    get: vi.fn(),
  },
}));

import api from '../lib/api';

const loginPromise = () => useAuthStore.getState().login({ email: 'a@b.com', password: 'x' });

describe('authStore', () => {
  beforeEach(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    useAuthStore.setState({ user: null, token: null, loading: false, error: null });
    vi.clearAllMocks();
  });

  it('has no initial user when localStorage is empty', () => {
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
  });

  it('login success stores user + token in state and localStorage', async () => {
    const mockUser = { id: 1, email: 'a@b.com' };
    api.post.mockResolvedValue({ data: { data: { user: mockUser, accessToken: 'tok-1' } } });

    const result = await loginPromise();

    expect(result.success).toBe(true);
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().token).toBe('tok-1');
    expect(localStorage.getItem('token')).toBe('tok-1');
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(mockUser);
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('login failure sets error and keeps state clean', async () => {
    api.post.mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } });

    const result = await loginPromise();

    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid credentials');
    expect(useAuthStore.getState().error).toBe('Invalid credentials');
    expect(useAuthStore.getState().user).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('register failure surfaces the API message', async () => {
    api.post.mockRejectedValue({ response: { data: { message: 'Email taken' } } });

    const result = await useAuthStore.getState().register({ email: 'a@b.com' });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Email taken');
    expect(useAuthStore.getState().error).toBe('Email taken');
  });

  it('logout clears user + token from state and localStorage', async () => {
    useAuthStore.setState({ user: { id: 1 }, token: 'tok' });
    localStorage.setItem('token', 'tok');
    localStorage.setItem('user', '{"id":1}');
    api.post.mockResolvedValue({});

    await useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('logout succeeds even if the API call fails', async () => {
    useAuthStore.setState({ user: { id: 1 }, token: 'tok' });
    api.post.mockRejectedValue(new Error('network down'));

    await useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
  });

  it('updateProfile success stores the updated user', async () => {
    const updated = { id: 1, firstName: 'New' };
    api.put.mockResolvedValue({ data: { user: updated } });

    const result = await useAuthStore.getState().updateProfile(new FormData());

    expect(result.success).toBe(true);
    expect(useAuthStore.getState().user).toEqual(updated);
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(updated);
  });

  it('setUser and clearError update state directly', () => {
    useAuthStore.getState().setUser({ id: 9 });
    expect(useAuthStore.getState().user).toEqual({ id: 9 });

    useAuthStore.setState({ error: 'oops' });
    useAuthStore.getState().clearError();
    expect(useAuthStore.getState().error).toBeNull();
  });
});
