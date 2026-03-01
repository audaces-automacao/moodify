import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let authServiceMock: any;
  let routerMock: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  let loginUrlTree: UrlTree;

  beforeEach(() => {
    loginUrlTree = { toString: () => '/login' } as UrlTree;
    authServiceMock = {
      verifyToken: vi.fn().mockName('AuthService.verifyToken'),
      isAuthenticated: vi.fn().mockName('AuthService.isAuthenticated'),
    };
    routerMock = {
      createUrlTree: vi.fn().mockName('Router.createUrlTree'),
    };
    routerMock.createUrlTree.mockReturnValue(loginUrlTree);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('should return true when already authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);

    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as never, {} as never);
      expect(result).toBe(true);
    });

    expect(authServiceMock.verifyToken).not.toHaveBeenCalled();
  });

  it('should call verifyToken when not authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    authServiceMock.verifyToken.mockReturnValue(of(true));

    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as never, {} as never);

      if (result instanceof Object && 'subscribe' in result) {
        result.subscribe(value => {
          expect(value).toBe(true);
        });
      }
    });

    expect(authServiceMock.verifyToken).toHaveBeenCalled();
  });

  it('should return UrlTree to login when token is invalid', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    authServiceMock.verifyToken.mockReturnValue(of(false));

    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as never, {} as never);

      if (result instanceof Object && 'subscribe' in result) {
        result.subscribe(value => {
          expect(value).toBe(loginUrlTree);
          expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
        });
      }
    });
  });

  it('should return true when token is valid', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    authServiceMock.verifyToken.mockReturnValue(of(true));

    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as never, {} as never);

      if (result instanceof Object && 'subscribe' in result) {
        result.subscribe(value => {
          expect(value).toBe(true);
        });
      }
    });
  });
});
