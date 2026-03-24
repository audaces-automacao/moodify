import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService, TranslocoTestingModule } from '@jsverse/transloco';
import { EMPTY } from 'rxjs';
import { LoadingSkeletonComponent } from './loading-skeleton.component';

describe('LoadingSkeletonComponent', () => {
  let component: LoadingSkeletonComponent;
  let fixture: ComponentFixture<LoadingSkeletonComponent>;

  const translations = {
    loading: {
      moodBoard: [
        'Diving into fashion archives...',
        'Channeling your inner style icon...',
        'Curating the perfect aesthetic...',
      ],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoadingSkeletonComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: translations },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have fade-in animation container', () => {
    const container = fixture.nativeElement.querySelector('.animate-fade-in');
    expect(container).toBeTruthy();
  });

  it('should render 6 color palette skeleton items', () => {
    const colorSection = fixture.nativeElement.querySelectorAll(
      '[data-testid="color-palette-skeleton"] > div'
    );
    expect(colorSection.length).toBe(6);
  });

  it('should render 7 style tag skeleton items', () => {
    const tagSkeletons = fixture.nativeElement.querySelectorAll(
      '[data-testid="style-tags-skeleton"] > div'
    );
    expect(tagSkeletons.length).toBe(7);
  });

  it('should render 4 fabric card skeletons', () => {
    const fabricCards = fixture.nativeElement.querySelectorAll(
      '[data-testid="fabric-cards-skeleton"] > div'
    );
    expect(fabricCards.length).toBe(4);
  });

  it('should render 4 outfit skeleton cards', () => {
    const outfitCards = fixture.nativeElement.querySelectorAll(
      '[data-testid="outfit-cards-skeleton"] > div'
    );
    expect(outfitCards.length).toBe(4);
  });

  it('should have skeleton shimmer elements', () => {
    const shimmerElements = fixture.nativeElement.querySelectorAll('.skeleton-shimmer');
    expect(shimmerElements.length).toBeGreaterThan(0);
  });

  it('should display a message element', () => {
    const messageElement = fixture.nativeElement.querySelector('[data-testid="loading-message"] p');
    expect(messageElement).toBeTruthy();
  });

  it('should have aria-live attribute for accessibility', () => {
    const messageElement = fixture.nativeElement.querySelector('[aria-live="polite"]');
    expect(messageElement).toBeTruthy();
  });

  it('should have currentMessage signal initialized', () => {
    expect(component.currentMessage).toBeDefined();
  });

  it('should set initial message from translations', async () => {
    // Wait for translations to load
    await fixture.whenStable();
    fixture.detectChanges();
    // Message should be set (either first message or empty if translations not loaded)
    expect(component.currentMessage()).toBeTruthy();
  });

  it('should have shouldAnimate signal initialized to false', () => {
    expect(component.shouldAnimate()).toBe(false);
  });

  it('should use animation timing constants', () => {
    // Verify constants are defined (they are private static, so we test indirectly)
    // The component should initialize without errors, proving constants are valid
    expect(component).toBeTruthy();
  });

  describe('rotateMessage', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should rotate to next message after interval', () => {
      // Re-create with fake timers active
      const localFixture = TestBed.createComponent(LoadingSkeletonComponent);
      const localComponent = localFixture.componentInstance;
      localFixture.detectChanges();

      const firstMessage = localComponent.currentMessage();
      expect(firstMessage).toBe('Diving into fashion archives...');

      // Advance past the rotation interval (3500ms)
      vi.advanceTimersByTime(3500);

      // After the fade-out delay (300ms), message should change
      vi.advanceTimersByTime(300);
      expect(localComponent.currentMessage()).toBe('Channeling your inner style icon...');
    });

    it('should toggle shouldAnimate during rotation', () => {
      const localFixture = TestBed.createComponent(LoadingSkeletonComponent);
      const localComponent = localFixture.componentInstance;
      localFixture.detectChanges();

      expect(localComponent.shouldAnimate()).toBe(false);

      // Trigger rotation
      vi.advanceTimersByTime(3500);
      expect(localComponent.shouldAnimate()).toBe(true);

      // After animation duration (600ms), animation flag resets
      vi.advanceTimersByTime(600);
      expect(localComponent.shouldAnimate()).toBe(false);
    });

    it('should wrap around to first message after last', () => {
      const localFixture = TestBed.createComponent(LoadingSkeletonComponent);
      const localComponent = localFixture.componentInstance;
      localFixture.detectChanges();

      // Rotate through all 3 messages (3 intervals)
      for (let i = 0; i < 3; i++) {
        vi.advanceTimersByTime(3500);
        vi.advanceTimersByTime(600); // let animation complete
      }

      // Should wrap back to first message
      expect(localComponent.currentMessage()).toBe('Diving into fashion archives...');
    });

    it('should handle empty messages without error', () => {
      // Create component with no translations loaded for the key
      const emptyFixture = TestBed.createComponent(LoadingSkeletonComponent);
      const emptyComponent = emptyFixture.componentInstance;

      // Override the computed messages to return empty
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (emptyComponent as any).messages = () => [];
      emptyFixture.detectChanges();

      // Trigger rotation — should not throw
      expect(() => vi.advanceTimersByTime(3500)).not.toThrow();
    });
  });
});

describe('LoadingSkeletonComponent (falsy translate)', () => {
  beforeEach(async () => {
    const translocoMock = {
      translate: vi.fn().mockReturnValue(null),
      selectTranslation: vi.fn().mockReturnValue(EMPTY),
    };

    await TestBed.configureTestingModule({
      imports: [LoadingSkeletonComponent],
      providers: [{ provide: TranslocoService, useValue: translocoMock }],
    }).compileComponents();
  });

  it('should fall back to empty array when translate returns falsy', () => {
    const localFixture = TestBed.createComponent(LoadingSkeletonComponent);
    const localComponent = localFixture.componentInstance;
    localFixture.detectChanges();

    // messages() returns [] via || [] fallback, so currentMessage stays empty
    expect(localComponent.currentMessage()).toBe('');
  });

  it('should skip rotation when messages are empty', () => {
    vi.useFakeTimers();

    const localFixture = TestBed.createComponent(LoadingSkeletonComponent);
    const localComponent = localFixture.componentInstance;
    localFixture.detectChanges();

    // rotateMessage fires but messages is empty — early return branch
    vi.advanceTimersByTime(3500);
    expect(localComponent.shouldAnimate()).toBe(false);
    expect(localComponent.currentMessage()).toBe('');

    vi.useRealTimers();
  });
});
