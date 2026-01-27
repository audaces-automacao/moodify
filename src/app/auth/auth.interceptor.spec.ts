import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getToken', 'logout']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should skip auth header for login endpoint', () => {
    authServiceMock.getToken.and.returnValue('test-token');

    httpClient.post('/api/auth/login', {}).subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should add Authorization header when token exists', () => {
    authServiceMock.getToken.and.returnValue('test-token');

    httpClient.get('/api/chat/completions').subscribe();

    const req = httpMock.expectOne('/api/chat/completions');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush({});
  });

  it('should pass through request when no token exists', () => {
    authServiceMock.getToken.and.returnValue(null);

    httpClient.get('/api/chat/completions').subscribe();

    const req = httpMock.expectOne('/api/chat/completions');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should call logout on 401 response for non-auth endpoints', () => {
    authServiceMock.getToken.and.returnValue('expired-token');

    httpClient.get('/api/chat/completions').subscribe({
      error: () => {
        expect(authServiceMock.logout).toHaveBeenCalled();
      },
    });

    const req = httpMock.expectOne('/api/chat/completions');
    req.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
  });

  it('should not call logout on 401 for auth endpoints', () => {
    authServiceMock.getToken.and.returnValue('test-token');

    httpClient.get('/api/auth/verify').subscribe({
      error: () => {
        expect(authServiceMock.logout).not.toHaveBeenCalled();
      },
    });

    const req = httpMock.expectOne('/api/auth/verify');
    req.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
  });

  it('should not call logout on non-401 errors', () => {
    authServiceMock.getToken.and.returnValue('test-token');

    httpClient.get('/api/chat/completions').subscribe({
      error: () => {
        expect(authServiceMock.logout).not.toHaveBeenCalled();
      },
    });

    const req = httpMock.expectOne('/api/chat/completions');
    req.flush({ error: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });
  });
});
