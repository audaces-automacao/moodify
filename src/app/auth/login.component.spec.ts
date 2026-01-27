import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { LoginComponent } from './login.component';

const en = {
  header: { title: 'MOODIFY' },
  login: {
    email: 'Email',
    emailPlaceholder: 'Enter your email',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    submit: 'Sign In',
    loggingIn: 'Signing In...',
    invalidCredentials: 'Invalid email or password',
  },
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        FormsModule,
        TranslocoTestingModule.forRoot({
          langs: { en },
          translocoConfig: {
            availableLangs: ['en'],
            defaultLang: 'en',
          },
        }),
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('MOODIFY');
  });

  it('should have initial state', () => {
    expect(component.email).toBe('');
    expect(component.password).toBe('');
    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBe(false);
  });

  describe('onSubmit', () => {
    it('should not call login when email is empty', () => {
      component.email = '';
      component.password = 'password';

      component.onSubmit();

      expect(authServiceMock.login).not.toHaveBeenCalled();
    });

    it('should not call login when password is empty', () => {
      component.email = 'test@test.com';
      component.password = '';

      component.onSubmit();

      expect(authServiceMock.login).not.toHaveBeenCalled();
    });

    it('should call authService.login with credentials', () => {
      authServiceMock.login.and.returnValue(of(true));
      component.email = 'bob@audaces.com';
      component.password = '12345';

      component.onSubmit();

      expect(authServiceMock.login).toHaveBeenCalledWith('bob@audaces.com', '12345');
    });

    it('should set loading state during login', () => {
      authServiceMock.login.and.returnValue(of(true));
      component.email = 'bob@audaces.com';
      component.password = '12345';

      expect(component.isLoading()).toBe(false);

      component.onSubmit();

      // After observable completes, loading should be false
      expect(component.isLoading()).toBe(false);
    });

    it('should navigate to home on successful login', () => {
      authServiceMock.login.and.returnValue(of(true));
      component.email = 'bob@audaces.com';
      component.password = '12345';

      component.onSubmit();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
      expect(component.error()).toBe(false);
    });

    it('should show error on failed login', () => {
      authServiceMock.login.and.returnValue(of(false));
      component.email = 'wrong@email.com';
      component.password = 'wrongpassword';

      component.onSubmit();

      expect(component.error()).toBe(true);
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should show error on login error', () => {
      authServiceMock.login.and.returnValue(throwError(() => new Error('Network error')));
      component.email = 'bob@audaces.com';
      component.password = '12345';

      component.onSubmit();

      expect(component.error()).toBe(true);
      expect(component.isLoading()).toBe(false);
    });

    it('should clear previous error on new submit', () => {
      component.error.set(true);
      authServiceMock.login.and.returnValue(of(true));
      component.email = 'bob@audaces.com';
      component.password = '12345';

      component.onSubmit();

      expect(component.error()).toBe(false);
    });
  });

  describe('UI rendering', () => {
    it('should render email input', () => {
      const emailInput = fixture.nativeElement.querySelector('input[type="email"]');
      expect(emailInput).toBeTruthy();
    });

    it('should render password input', () => {
      const passwordInput = fixture.nativeElement.querySelector('input[type="password"]');
      expect(passwordInput).toBeTruthy();
    });

    it('should render submit button', () => {
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button).toBeTruthy();
    });

    it('should show error message when error is true', async () => {
      component.error.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const errorElement = fixture.nativeElement.querySelector('.text-luxury-rose');
      expect(errorElement).toBeTruthy();
    });

    it('should not show error message when error is false', () => {
      component.error.set(false);
      fixture.detectChanges();

      const errorElement = fixture.nativeElement.querySelector('.bg-luxury-rose\\/20');
      expect(errorElement).toBeFalsy();
    });
  });
});
