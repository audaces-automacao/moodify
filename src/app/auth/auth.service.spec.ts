import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let routerMock: any;

  beforeEach(() => {
    routerMock = {
      navigate: vi.fn().mockName('Router.navigate'),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerMock },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('getToken', () => {
    it('should return null when no token is stored', () => {
      expect(service.getToken()).toBeNull();
    });

    it('should return token from localStorage', () => {
      localStorage.setItem('auth_token', 'test-token');
      expect(service.getToken()).toBe('test-token');
    });
  });

  describe('login', () => {
    it('should store token and update signals on successful login', () => {
      const mockResponse = { token: 'jwt-token', email: 'bob@audaces.com' };

      service.login('bob@audaces.com', '12345').subscribe((result) => {
        expect(result).toBe(true);
        expect(localStorage.getItem('auth_token')).toBe('jwt-token');
        expect(service.isAuthenticated()).toBe(true);
        expect(service.userEmail()).toBe('bob@audaces.com');
      });

      const req = httpMock.expectOne('/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'bob@audaces.com', password: '12345' });
      req.flush(mockResponse);
    });

    it('should return false on failed login', () => {
      service.login('wrong@email.com', 'wrong').subscribe((result) => {
        expect(result).toBe(false);
        expect(localStorage.getItem('auth_token')).toBeNull();
        expect(service.isAuthenticated()).toBe(false);
      });

      const req = httpMock.expectOne('/api/auth/login');
      req.flush({ error: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should clear token, reset signals, and navigate to login', () => {
      localStorage.setItem('auth_token', 'test-token');
      service.isAuthenticated.set(true);
      service.userEmail.set('bob@audaces.com');

      service.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
      expect(service.userEmail()).toBeNull();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('verifyToken', () => {
    it('should return false when no token exists', () => {
      service.verifyToken().subscribe((result) => {
        expect(result).toBe(false);
      });

      httpMock.expectNone('/api/auth/verify');
    });

    it('should validate token and update signals on success', () => {
      localStorage.setItem('auth_token', 'valid-token');
      const mockResponse = { valid: true, email: 'bob@audaces.com' };

      service.verifyToken().subscribe((result) => {
        expect(result).toBe(true);
        expect(service.isAuthenticated()).toBe(true);
        expect(service.userEmail()).toBe('bob@audaces.com');
      });

      const req = httpMock.expectOne('/api/auth/verify');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call logout and return false on invalid token', () => {
      localStorage.setItem('auth_token', 'invalid-token');

      service.verifyToken().subscribe((result) => {
        expect(result).toBe(false);
        expect(service.isAuthenticated()).toBe(false);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
      });

      const req = httpMock.expectOne('/api/auth/verify');
      req.flush({ error: 'Invalid token' }, { status: 401, statusText: 'Unauthorized' });
    });
  });
});
