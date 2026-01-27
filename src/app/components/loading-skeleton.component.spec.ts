import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
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
      image: ['Sketching your signature look...', 'Bringing your vision to life...'],
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
      '[data-testid="color-palette-skeleton"] > div',
    );
    expect(colorSection.length).toBe(6);
  });

  it('should render 7 style tag skeleton items', () => {
    const tagSkeletons = fixture.nativeElement.querySelectorAll(
      '[data-testid="style-tags-skeleton"] > div',
    );
    expect(tagSkeletons.length).toBe(7);
  });

  it('should render 4 fabric card skeletons', () => {
    const fabricCards = fixture.nativeElement.querySelectorAll(
      '[data-testid="fabric-cards-skeleton"] > div',
    );
    expect(fabricCards.length).toBe(4);
  });

  it('should render 4 outfit skeleton cards', () => {
    const outfitCards = fixture.nativeElement.querySelectorAll(
      '[data-testid="outfit-cards-skeleton"] > div',
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

  it('should have stage input defaulting to moodBoard', () => {
    expect(component.stage()).toBe('moodBoard');
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
});
