import { describe, it, expect, beforeEach, vi } from 'vitest';
import authService from '../services/authService';
import api, { TOKEN_STORAGE_KEY } from '../services/api';

vi.mock('../services/api', () => {
  const mockApi = {
    post: vi.fn(),
    get: vi.fn(),
  };
  return {
    default: mockApi,
    TOKEN_STORAGE_KEY: 'cinebook_token',
  };
});

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('Scenario 1: Registers a new user via POST /auth/register', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        message: "Ro'yxatdan muvaffaqiyatli o'tildi",
        user: { id: 1, name: 'Ali', email: 'ali@example.com' },
      },
    });

    const result = await authService.register({
      name: 'Ali',
      email: 'ali@example.com',
      password: 'password123',
    });

    expect(api.post).toHaveBeenCalledWith('/auth/register', {
      name: 'Ali',
      email: 'ali@example.com',
      password: 'password123',
    });
    expect(result.user.name).toBe('Ali');
  });

  it('Scenario 2: Logs in user and stores token in localStorage', async () => {
    const fakeToken = 'jwt_test_token_12345';
    api.post.mockResolvedValueOnce({
      data: {
        token: fakeToken,
        user: { id: 1, name: 'Ali', email: 'ali@example.com' },
      },
    });

    const result = await authService.login({
      email: 'ali@example.com',
      password: 'password123',
    });

    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'ali@example.com',
      password: 'password123',
    });
    expect(authService.getToken()).toBe(fakeToken);
    expect(authService.hasToken()).toBe(true);
  });

  it('Scenario 3: Fetches current user profile via GET /auth/me', async () => {
    const mockUser = { id: 1, name: 'Ali', email: 'ali@example.com' };
    api.get.mockResolvedValueOnce({ data: mockUser });

    const user = await authService.getMe();
    expect(api.get).toHaveBeenCalledWith('/auth/me');
    expect(user.id).toBe(1);
    expect(user.email).toBe('ali@example.com');
  });

  it('Scenario 18: Clears token and session on logout', () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, 'some_token');
    expect(authService.hasToken()).toBe(true);

    authService.logout();
    expect(authService.hasToken()).toBe(false);
    expect(authService.getToken()).toBeNull();
  });
});
