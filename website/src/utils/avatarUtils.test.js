import { describe, it, expect } from 'vitest';
import { getAvatarUrl, getAvatarUrlWithColor } from './avatarUtils';

describe('getAvatarUrl', () => {
  it('returns ui-avatars URL with encoded full name', () => {
    const url = getAvatarUrl('Dhruv', 'Shah');
    expect(url).toContain('name=Dhruv%20Shah');
    expect(url).toContain('background=1E88E5');
  });

  it('handles missing names gracefully with User fallback', () => {
    const url = getAvatarUrl();
    expect(url).toContain('name=User');
  });

  it('returns custom image directly when provided', () => {
    const custom = 'https://example.com/me.png';
    expect(getAvatarUrl('Dhruv', 'Shah', custom)).toBe(custom);
  });

  it('falls back to generated avatar for blank custom image', () => {
    expect(getAvatarUrl('Dhruv', 'Shah', '   ')).toContain('ui-avatars.com');
  });
});

describe('getAvatarUrlWithColor', () => {
  it('uses the provided background color', () => {
    const url = getAvatarUrlWithColor('Asha', 'Patel', 'FF5722');
    expect(url).toContain('background=FF5722');
  });

  it('prefers custom image over color', () => {
    const custom = 'https://example.com/me.png';
    expect(getAvatarUrlWithColor('Asha', 'Patel', 'FF5722', custom)).toBe(custom);
  });
});
