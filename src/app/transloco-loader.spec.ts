import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TranslocoHttpLoader } from './transloco-loader';

describe('TranslocoHttpLoader', () => {
  let loader: TranslocoHttpLoader;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslocoHttpLoader, provideHttpClient(), provideHttpClientTesting()],
    });

    loader = TestBed.inject(TranslocoHttpLoader);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(loader).toBeTruthy();
  });

  it('should fetch English translations', () => {
    const mockTranslations = {
      header: { title: 'MOODIFY' },
      app: {
        footer: '100% written by Claude Code',
        footerStack: 'Angular 21 + Tailwind CSS + OpenAI',
      },
    };

    loader.getTranslation('en').subscribe((result) => {
      expect(result).toEqual(mockTranslations);
    });

    const req = httpMock.expectOne('/assets/i18n/en.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockTranslations);
  });

  it('should fetch Portuguese translations', () => {
    const mockTranslations = {
      header: { title: 'MOODIFY' },
      app: {
        footer: '100% escrito pelo Claude Code',
        footerStack: 'Angular 21 + Tailwind CSS + OpenAI',
      },
    };

    loader.getTranslation('pt-BR').subscribe((result) => {
      expect(result).toEqual(mockTranslations);
    });

    const req = httpMock.expectOne('/assets/i18n/pt-BR.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockTranslations);
  });

  it('should use correct URL pattern', () => {
    loader.getTranslation('fr').subscribe();

    const req = httpMock.expectOne('/assets/i18n/fr.json');
    expect(req.request.url).toBe('/assets/i18n/fr.json');
    req.flush({});
  });

  it('should handle HTTP errors', () => {
    let errorResponse: unknown;

    loader.getTranslation('invalid').subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        errorResponse = error;
      },
    });

    const req = httpMock.expectOne('/assets/i18n/invalid.json');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });

    expect(errorResponse).toBeTruthy();
  });
});
