import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { OpenAIService } from './openai.service';

describe('OpenAIService edge cases', () => {
  let service: OpenAIService;
  let httpMock: HttpTestingController;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let translocoServiceMock: any;

  beforeEach(() => {
    translocoServiceMock = {
      getActiveLang: vi.fn().mockReturnValue('en'),
      translate: vi.fn().mockImplementation((key: string) => key),
    };

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

  describe('generateMoodBoard network errors', () => {
    it('should handle network error with no HTTP status', () => {
      service.generateMoodBoard('test').subscribe({
        error: err => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toBeTruthy();
        },
      });

      const req = httpMock.expectOne('/api/chat/completions');
      req.error(new ProgressEvent('error'));
    });
  });

  describe('generateOutfitImage network errors', () => {
    const mockOutfit = {
      top: 'T-shirt',
      bottom: 'Jeans',
      shoes: 'Sneakers',
      accessories: ['Cap'],
    };
    const mockKeywords = ['Casual'];

    it('should handle network error with no HTTP status', () => {
      service.generateOutfitImage(mockOutfit, mockKeywords).subscribe({
        error: err => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toBeTruthy();
        },
      });

      const req = httpMock.expectOne('/api/images/generations');
      req.error(new ProgressEvent('error'));
    });

    it('should handle 500 error via shared HTTP_ERROR_MESSAGES', () => {
      service.generateOutfitImage(mockOutfit, mockKeywords).subscribe({
        error: () => {
          expect(translocoServiceMock.translate).toHaveBeenCalledWith('errors.serviceUnavailable');
        },
      });

      const req = httpMock.expectOne('/api/images/generations');
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
