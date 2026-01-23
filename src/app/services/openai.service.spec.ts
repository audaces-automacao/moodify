import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TranslocoService } from '@jsverse/transloco';
import { OpenAIService } from './openai.service';

describe('OpenAIService', () => {
  let service: OpenAIService;
  let httpMock: HttpTestingController;
  let translocoServiceMock: jasmine.SpyObj<TranslocoService>;

  const validMoodBoardResponse = {
    colorPalette: [{ name: 'Blue', hex: '#0000FF', usage: 'primary' }],
    fabrics: [{ name: 'Silk', description: 'Luxurious', texture: 'Smooth', season: 'Spring' }],
    styleKeywords: ['Elegant'],
    outfitSuggestions: {
      top: 'Blouse',
      bottom: 'Skirt',
      shoes: 'Heels',
      accessories: ['Watch'],
    },
    aestheticDescription: 'Test aesthetic description',
  };

  const mockOpenAIResponse = {
    choices: [
      {
        message: {
          content: JSON.stringify(validMoodBoardResponse),
        },
      },
    ],
  };

  beforeEach(() => {
    translocoServiceMock = jasmine.createSpyObj('TranslocoService', ['getActiveLang', 'translate']);
    translocoServiceMock.getActiveLang.and.returnValue('en');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (translocoServiceMock.translate as any).and.callFake((key: string) => key);

    TestBed.configureTestingModule({
      providers: [
        OpenAIService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TranslocoService, useValue: translocoServiceMock },
      ],
    });

    service = TestBed.inject(OpenAIService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateMoodBoard', () => {
    it('should make POST request with correct headers and body', () => {
      service.generateMoodBoard('Parisian chic').subscribe();

      const req = httpMock.expectOne('https://api.openai.com/v1/chat/completions');
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.headers.get('Authorization')).toContain('Bearer');
      expect(req.request.body.messages[1].content).toContain('Parisian chic');
      req.flush(mockOpenAIResponse);
    });

    it('should parse valid JSON response', (done) => {
      service.generateMoodBoard('test').subscribe({
        next: (result) => {
          expect(result.aestheticDescription).toBe('Test aesthetic description');
          expect(result.colorPalette.length).toBe(1);
          done();
        },
      });

      const req = httpMock.expectOne('https://api.openai.com/v1/chat/completions');
      req.flush(mockOpenAIResponse);
    });

    it('should strip markdown code blocks from response', (done) => {
      const jsonContent = JSON.stringify(validMoodBoardResponse);
      const responseWithMarkdown = {
        choices: [{ message: { content: '```json\n' + jsonContent + '\n```' } }],
      };

      service.generateMoodBoard('test').subscribe({
        next: (result) => {
          expect(result.aestheticDescription).toBe('Test aesthetic description');
          done();
        },
      });

      const req = httpMock.expectOne('https://api.openai.com/v1/chat/completions');
      req.flush(responseWithMarkdown);
    });

    it('should strip json code blocks without newline', (done) => {
      const jsonContent = JSON.stringify(validMoodBoardResponse);
      const responseWithMarkdown = {
        choices: [{ message: { content: '```json' + jsonContent + '```' } }],
      };

      service.generateMoodBoard('test').subscribe({
        next: (result) => {
          expect(result.aestheticDescription).toBe('Test aesthetic description');
          done();
        },
      });

      const req = httpMock.expectOne('https://api.openai.com/v1/chat/completions');
      req.flush(responseWithMarkdown);
    });

    it('should throw error when no content in response', (done) => {
      const emptyResponse = {
        choices: [{ message: { content: '' } }],
      };

      service.generateMoodBoard('test').subscribe({
        error: () => {
          expect(translocoServiceMock.translate).toHaveBeenCalledWith('errors.noResponse');
          done();
        },
      });

      const req = httpMock.expectOne('https://api.openai.com/v1/chat/completions');
      req.flush(emptyResponse);
    });

    it('should throw error on invalid JSON', (done) => {
      const invalidJsonResponse = {
        choices: [{ message: { content: 'not valid json' } }],
      };

      service.generateMoodBoard('test').subscribe({
        error: () => {
          expect(translocoServiceMock.translate).toHaveBeenCalledWith('errors.parseError');
          done();
        },
      });

      const req = httpMock.expectOne('https://api.openai.com/v1/chat/completions');
      req.flush(invalidJsonResponse);
    });

    it('should handle 401 error', (done) => {
      service.generateMoodBoard('test').subscribe({
        error: () => {
          expect(translocoServiceMock.translate).toHaveBeenCalledWith('errors.invalidApiKey');
          done();
        },
      });

      const req = httpMock.expectOne('https://api.openai.com/v1/chat/completions');
      req.flush(null, { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle 429 error (rate limited)', (done) => {
      service.generateMoodBoard('test').subscribe({
        error: () => {
          expect(translocoServiceMock.translate).toHaveBeenCalledWith('errors.rateLimited');
          done();
        },
      });

      const req = httpMock.expectOne('https://api.openai.com/v1/chat/completions');
      req.flush(null, { status: 429, statusText: 'Too Many Requests' });
    });

    it('should handle 500 error', (done) => {
      service.generateMoodBoard('test').subscribe({
        error: () => {
          expect(translocoServiceMock.translate).toHaveBeenCalledWith('errors.serviceUnavailable');
          done();
        },
      });

      const req = httpMock.expectOne('https://api.openai.com/v1/chat/completions');
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle generic error (non 401/429/500)', (done) => {
      service.generateMoodBoard('test').subscribe({
        error: (err) => {
          // For non-specific errors, it uses the error message or falls back to generic
          expect(err).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne('https://api.openai.com/v1/chat/completions');
      req.flush(null, { status: 503, statusText: 'Service Unavailable' });
    });

    it('should use English prompt when active lang is en', () => {
      translocoServiceMock.getActiveLang.and.returnValue('en');

      service.generateMoodBoard('test').subscribe();

      const req = httpMock.expectOne('https://api.openai.com/v1/chat/completions');
      expect(req.request.body.messages[0].content).toContain('Respond in English');
      req.flush(mockOpenAIResponse);
    });

    it('should use Portuguese prompt when active lang is pt-BR', () => {
      translocoServiceMock.getActiveLang.and.returnValue('pt-BR');

      service.generateMoodBoard('test').subscribe();

      const req = httpMock.expectOne('https://api.openai.com/v1/chat/completions');
      expect(req.request.body.messages[0].content).toContain('Brazilian Portuguese');
      req.flush(mockOpenAIResponse);
    });

    it('should configure request with correct message roles and parameters', () => {
      service.generateMoodBoard('test').subscribe();

      const req = httpMock.expectOne('https://api.openai.com/v1/chat/completions');
      expect(req.request.body.messages[0].role).toBe('system');
      expect(req.request.body.messages[1].role).toBe('user');
      expect(req.request.body.temperature).toBe(0.7);
      expect(req.request.body.max_tokens).toBe(1500);
      req.flush(mockOpenAIResponse);
    });
  });
});
