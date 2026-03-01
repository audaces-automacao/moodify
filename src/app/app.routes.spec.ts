import { routes } from './app.routes';
import { authGuard } from './auth/auth.guard';

describe('routes', () => {
  it('should have a login route', () => {
    const loginRoute = routes.find((r) => r.path === 'login');
    expect(loginRoute).toBeDefined();
    expect(loginRoute?.loadComponent).toBeDefined();
  });

  it('should have a home route at root path', () => {
    const homeRoute = routes.find((r) => r.path === '');
    expect(homeRoute).toBeDefined();
    expect(homeRoute?.loadComponent).toBeDefined();
  });

  it('should apply authGuard to home route', () => {
    const homeRoute = routes.find((r) => r.path === '');
    expect(homeRoute?.canActivate).toBeDefined();
    expect(homeRoute?.canActivate).toContain(authGuard);
  });

  it('should not apply authGuard to login route', () => {
    const loginRoute = routes.find((r) => r.path === 'login');
    expect(loginRoute?.canActivate).toBeUndefined();
  });

  it('should have a wildcard redirect to home', () => {
    const wildcardRoute = routes.find((r) => r.path === '**');
    expect(wildcardRoute).toBeDefined();
    expect(wildcardRoute?.redirectTo).toBe('');
  });

  it('should have a library route', () => {
    const libraryRoute = routes.find((r) => r.path === 'library');
    expect(libraryRoute).toBeDefined();
    expect(libraryRoute?.loadComponent).toBeDefined();
    expect(libraryRoute?.canActivate).toContain(authGuard);
  });

  it('should have a library detail route with id param', () => {
    const libraryDetailRoute = routes.find((r) => r.path === 'library/:id');
    expect(libraryDetailRoute).toBeDefined();
    expect(libraryDetailRoute?.loadComponent).toBeDefined();
    expect(libraryDetailRoute?.canActivate).toContain(authGuard);
  });

  it('should have exactly 5 routes configured', () => {
    expect(routes.length).toBe(5);
  });
});
