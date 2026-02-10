import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { OpenAIService } from './openai.service';

describe('OpenAIService', () => {
  let service: OpenAIService;
  let httpMock: HttpTestingController;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let translocoServiceMock: any;

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
    translocoServiceMock = {
      getActiveLang: vi.fn().mockName('TranslocoService.getActiveLang'),
      translate: vi.fn().mockName('TranslocoService.translate'),
    };
    translocoServiceMock.getActiveLang.mockReturnValue('en');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (translocoServiceMock.translate as any).mockImplementation((key: string) => key);

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

      const req = httpMock.expectOne('/api/chat/completions');
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.body.messages[1].content).toContain('Parisian chic');
      req.flush(mockOpenAIResponse);
    });

    it('should parse valid JSON response', () => {
      service.generateMoodBoard('test').subscribe({
        next: (result) => {
          expect(result.aestheticDescription).toBe('Test aesthetic description');
          expect(result.colorPalette.length).toBe(1);
        },
      });

      const req = httpMock.expectOne('/api/chat/completions');
      req.flush(mockOpenAIResponse);
    });

    it('should strip markdown code blocks from response', () => {
      const jsonContent = JSON.stringify(validMoodBoardResponse);
      const responseWithMarkdown = {
        choices: [{ message: { content: '```json\n' + jsonContent + '\n```' } }],
      };

      service.generateMoodBoard('test').subscribe({
        next: (result) => {
          expect(result.aestheticDescription).toBe('Test aesthetic description');
        },
      });

      const req = httpMock.expectOne('/api/chat/completions');
      req.flush(responseWithMarkdown);
    });

    it('should strip json code blocks without newline', () => {
      const jsonContent = JSON.stringify(validMoodBoardResponse);
      const responseWithMarkdown = {
        choices: [{ message: { content: '```json' + jsonContent + '```' } }],
      };

      service.generateMoodBoard('test').subscribe({
        next: (result) => {
          expect(result.aestheticDescription).toBe('Test aesthetic description');
        },
      });

      const req = httpMock.expectOne('/api/chat/completions');
      req.flush(responseWithMarkdown);
    });

    it('should throw error when no content in response', () => {
      const emptyResponse = {
        choices: [{ message: { content: '' } }],
      };

      service.generateMoodBoard('test').subscribe({
        error: () => {
          expect(translocoServiceMock.translate).toHaveBeenCalledWith('errors.noResponse');
        },
      });

      const req = httpMock.expectOne('/api/chat/completions');
      req.flush(emptyResponse);
    });

    it('should throw error on invalid JSON', () => {
      const invalidJsonResponse = {
        choices: [{ message: { content: 'not valid json' } }],
      };

      service.generateMoodBoard('test').subscribe({
        error: () => {
          expect(translocoServiceMock.translate).toHaveBeenCalledWith('errors.parseError');
        },
      });

      const req = httpMock.expectOne('/api/chat/completions');
      req.flush(invalidJsonResponse);
    });

    it('should handle 401 error', () => {
      service.generateMoodBoard('test').subscribe({
        error: () => {
          expect(translocoServiceMock.translate).toHaveBeenCalledWith('errors.invalidApiKey');
        },
      });

      const req = httpMock.expectOne('/api/chat/completions');
      req.flush(null, { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle 429 error (rate limited)', () => {
      service.generateMoodBoard('test').subscribe({
        error: () => {
          expect(translocoServiceMock.translate).toHaveBeenCalledWith('errors.rateLimited');
        },
      });

      const req = httpMock.expectOne('/api/chat/completions');
      req.flush(null, { status: 429, statusText: 'Too Many Requests' });
    });

    it('should handle 500 error', () => {
      service.generateMoodBoard('test').subscribe({
        error: () => {
          expect(translocoServiceMock.translate).toHaveBeenCalledWith('errors.serviceUnavailable');
        },
      });

      const req = httpMock.expectOne('/api/chat/completions');
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle generic error (non 401/429/500)', () => {
      service.generateMoodBoard('test').subscribe({
        error: (err) => {
          // For non-specific errors, it uses the error message or falls back to generic
          expect(err).toBeTruthy();
        },
      });

      const req = httpMock.expectOne('/api/chat/completions');
      req.flush(null, { status: 503, statusText: 'Service Unavailable' });
    });

    it('should use English prompt when active lang is en', () => {
      translocoServiceMock.getActiveLang.mockReturnValue('en');

      service.generateMoodBoard('test').subscribe();

      const req = httpMock.expectOne('/api/chat/completions');
      expect(req.request.body.messages[0].content).toContain('Respond in English');
      req.flush(mockOpenAIResponse);
    });

    it('should use Portuguese prompt when active lang is pt-BR', () => {
      translocoServiceMock.getActiveLang.mockReturnValue('pt-BR');

      service.generateMoodBoard('test').subscribe();

      const req = httpMock.expectOne('/api/chat/completions');
      expect(req.request.body.messages[0].content).toContain('Brazilian Portuguese');
      req.flush(mockOpenAIResponse);
    });

    it('should configure request with correct message roles and parameters', () => {
      service.generateMoodBoard('test').subscribe();

      const req = httpMock.expectOne('/api/chat/completions');
      expect(req.request.body.messages[0].role).toBe('system');
      expect(req.request.body.messages[1].role).toBe('user');
      expect(req.request.body.temperature).toBe(0.7);
      expect(req.request.body.max_tokens).toBe(1500);
      req.flush(mockOpenAIResponse);
    });
  });

  describe('generateOutfitImage', () => {
    const mockOutfit = {
      top: 'Silk blouse',
      bottom: 'High-waisted trousers',
      shoes: 'Pointed-toe pumps',
      accessories: ['Gold watch', 'Pearl earrings'],
      outerwear: 'Tailored coat',
    };

    const mockStyleKeywords = ['Elegant', 'Sophisticated', 'Timeless'];

    const mockDallEResponse = {
      created: 1234567890,
      data: [{ url: 'https://example.com/generated-image.png' }],
    };

    it('should make POST request to image generation endpoint with correct headers', () => {
      service.generateOutfitImage(mockOutfit, mockStyleKeywords).subscribe();

      const req = httpMock.expectOne('/api/images/generations');
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockDallEResponse);
    });

    it('should send correct request body', () => {
      service.generateOutfitImage(mockOutfit, mockStyleKeywords).subscribe();

      const req = httpMock.expectOne('/api/images/generations');
      expect(req.request.body.model).toBe('dall-e-3');
      expect(req.request.body.n).toBe(1);
      expect(req.request.body.size).toBe('1024x1024');
      expect(req.request.body.quality).toBe('standard');
      expect(req.request.body.response_format).toBe('url');
      req.flush(mockDallEResponse);
    });

    it('should build prompt with outfit items', () => {
      service.generateOutfitImage(mockOutfit, mockStyleKeywords).subscribe();

      const req = httpMock.expectOne('/api/images/generations');
      const prompt = req.request.body.prompt;
      expect(prompt).toContain('Silk blouse');
      expect(prompt).toContain('High-waisted trousers');
      expect(prompt).toContain('Pointed-toe pumps');
      expect(prompt).toContain('Tailored coat');
      expect(prompt).toContain('Gold watch');
      expect(prompt).toContain('Pearl earrings');
      req.flush(mockDallEResponse);
    });

    it('should build prompt with style keywords', () => {
      service.generateOutfitImage(mockOutfit, mockStyleKeywords).subscribe();

      const req = httpMock.expectOne('/api/images/generations');
      const prompt = req.request.body.prompt;
      expect(prompt).toContain('Elegant');
      expect(prompt).toContain('Sophisticated');
      expect(prompt).toContain('Timeless');
      req.flush(mockDallEResponse);
    });

    it('should return image URL on success', () => {
      service.generateOutfitImage(mockOutfit, mockStyleKeywords).subscribe({
        next: (url) => {
          expect(url).toBe('https://example.com/generated-image.png');
        },
      });

      const req = httpMock.expectOne('/api/images/generations');
      req.flush(mockDallEResponse);
    });

    it('should handle outfit without outerwear', () => {
      const outfitWithoutOuterwear = {
        top: 'T-shirt',
        bottom: 'Jeans',
        shoes: 'Sneakers',
        accessories: ['Cap'],
      };

      service.generateOutfitImage(outfitWithoutOuterwear, mockStyleKeywords).subscribe();

      const req = httpMock.expectOne('/api/images/generations');
      const prompt = req.request.body.prompt;
      expect(prompt).toContain('T-shirt');
      expect(prompt).toContain('Jeans');
      expect(prompt).not.toContain('undefined');
      req.flush(mockDallEResponse);
    });

    it('should handle 400 error (content policy)', () => {
      service.generateOutfitImage(mockOutfit, mockStyleKeywords).subscribe({
        error: () => {
          expect(translocoServiceMock.translate).toHaveBeenCalledWith('errors.imagePromptRejected');
        },
      });

      const req = httpMock.expectOne('/api/images/generations');
      req.flush(null, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle 401 error', () => {
      service.generateOutfitImage(mockOutfit, mockStyleKeywords).subscribe({
        error: () => {
          expect(translocoServiceMock.translate).toHaveBeenCalledWith('errors.invalidApiKey');
        },
      });

      const req = httpMock.expectOne('/api/images/generations');
      req.flush(null, { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle 429 error (rate limited)', () => {
      service.generateOutfitImage(mockOutfit, mockStyleKeywords).subscribe({
        error: () => {
          expect(translocoServiceMock.translate).toHaveBeenCalledWith('errors.rateLimited');
        },
      });

      const req = httpMock.expectOne('/api/images/generations');
      req.flush(null, { status: 429, statusText: 'Too Many Requests' });
    });

    it('should handle generic error', () => {
      service.generateOutfitImage(mockOutfit, mockStyleKeywords).subscribe({
        error: (err) => {
          // For non-mapped status codes, it uses the error message from HttpErrorResponse
          expect(err).toBeTruthy();
        },
      });

      const req = httpMock.expectOne('/api/images/generations');
      req.flush(null, { status: 503, statusText: 'Service Unavailable' });
    });
  });
});
