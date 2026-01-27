import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;
  let loginUrlTree: UrlTree;

  beforeEach(() => {
    loginUrlTree = { toString: () => '/login' } as UrlTree;
    authServiceMock = jasmine.createSpyObj('AuthService', ['verifyToken', 'isAuthenticated']);
    routerMock = jasmine.createSpyObj('Router', ['createUrlTree']);
    routerMock.createUrlTree.and.returnValue(loginUrlTree);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('should return true when already authenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(true);

    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as never, {} as never);
      expect(result).toBe(true);
    });

    expect(authServiceMock.verifyToken).not.toHaveBeenCalled();
  });

  it('should call verifyToken when not authenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(false);
    authServiceMock.verifyToken.and.returnValue(of(true));

    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as never, {} as never);

      if (result instanceof Object && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(true);
        });
      }
    });

    expect(authServiceMock.verifyToken).toHaveBeenCalled();
  });

  it('should return UrlTree to login when token is invalid', () => {
    authServiceMock.isAuthenticated.and.returnValue(false);
    authServiceMock.verifyToken.and.returnValue(of(false));

    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as never, {} as never);

      if (result instanceof Object && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(loginUrlTree);
          expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
        });
      }
    });
  });

  it('should return true when token is valid', () => {
    authServiceMock.isAuthenticated.and.returnValue(false);
    authServiceMock.verifyToken.and.returnValue(of(true));

    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as never, {} as never);

      if (result instanceof Object && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(true);
        });
      }
    });
  });
});
