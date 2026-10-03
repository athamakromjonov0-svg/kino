import { describe, it, expect } from 'vitest';
import { getErrorMessage, isAuthError, isConflictError } from '../utils/errorHandler';

describe('errorHandler utility', () => {
  it('handles network / connection errors', () => {
    const error = { code: 'ERR_NETWORK', message: 'Network Error' };
    const msg = getErrorMessage(error);
    expect(msg).toContain('Server bilan aloqa');
  });

  it('handles 400 Bad Request error', () => {
    const error = { response: { status: 400, data: { message: "Noto'g'ri maydon" } } };
    expect(getErrorMessage(error)).toBe("Noto'g'ri maydon");
  });

  it('handles 401 Unauthorized error and isAuthError returns true', () => {
    const error = { response: { status: 401, data: {} } };
    expect(getErrorMessage(error)).toContain('Autentifikatsiyadan');
    expect(isAuthError(error)).toBe(true);
  });

  it('handles 403 Forbidden error', () => {
    const error = { response: { status: 403, data: {} } };
    expect(getErrorMessage(error)).toContain('yetarli ruxsat yo\'q');
  });

  it('handles 404 Not Found error', () => {
    const error = { response: { status: 404, data: {} } };
    expect(getErrorMessage(error)).toContain('topilmadi');
  });

  it('handles 409 Conflict error and isConflictError returns true', () => {
    const error = { response: { status: 409, data: {} } };
    expect(getErrorMessage(error)).toContain('band');
    expect(isConflictError(error)).toBe(true);
  });

  it('handles 500 Server error', () => {
    const error = { response: { status: 500, data: {} } };
    expect(getErrorMessage(error)).toContain('Serverda ichki xatolik');
  });
});
