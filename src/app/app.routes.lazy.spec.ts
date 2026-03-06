import { routes } from './app.routes';
import { LoginComponent } from './auth/login.component';
import { HomeComponent } from './home.component';

describe('routes lazy loading', () => {
  it('should lazy-load LoginComponent', async () => {
    const loginRoute = routes.find(r => r.path === 'login');
    const component = await loginRoute!.loadComponent!();

    expect(component).toBe(LoginComponent);
  });

  it('should lazy-load HomeComponent', async () => {
    const homeRoute = routes.find(r => r.path === '');
    const component = await homeRoute!.loadComponent!();

    expect(component).toBe(HomeComponent);
  });
});
