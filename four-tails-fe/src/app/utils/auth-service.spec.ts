import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth-service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideRouter([])],
    });
    service = TestBed.inject(AuthService);
    localStorage.removeItem('token');
  });

  afterEach(() => {
    localStorage.removeItem('token');
  });

  it('reads role, email, and id from a JWT payload', () => {
    const payload = btoa(JSON.stringify({
      id: 42,
      email: 'user@example.com',
      role: 'CLIENT',
    })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    localStorage.setItem('token', `header.${payload}.signature`);

    expect(service.getRole()).toBe('CLIENT');
    expect(service.getUserEmail()).toBe('user@example.com');
    expect(service.getUserId()).toBe(42);
  });

  it('returns empty values when the token is missing', () => {
    expect(service.getRole()).toBeNull();
    expect(service.getUserEmail()).toBe('');
    expect(service.getUserId()).toBe('');
  });
});
