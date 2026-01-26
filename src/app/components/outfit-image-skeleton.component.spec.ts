import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { OutfitImageSkeletonComponent } from './outfit-image-skeleton.component';

describe('OutfitImageSkeletonComponent', () => {
  let component: OutfitImageSkeletonComponent;
  let fixture: ComponentFixture<OutfitImageSkeletonComponent>;

  const translations = {
    outfitImage: {
      generating: 'Generating outfit visualization...',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OutfitImageSkeletonComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: translations },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OutfitImageSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render skeleton shimmer for title', () => {
    const titleSkeleton = fixture.nativeElement.querySelector('.skeleton-shimmer.h-4.w-40');
    expect(titleSkeleton).toBeTruthy();
  });

  it('should render skeleton shimmer for image placeholder', () => {
    const imageSkeleton = fixture.nativeElement.querySelector('.skeleton-shimmer.aspect-square');
    expect(imageSkeleton).toBeTruthy();
  });

  it('should render generating text', () => {
    const generatingText = fixture.nativeElement.querySelector('p');
    expect(generatingText.textContent).toContain('Generating outfit visualization...');
  });

  it('should have fade-in animation', () => {
    const section = fixture.nativeElement.querySelector('section');
    expect(section.classList.contains('animate-fade-in')).toBe(true);
  });

  it('should have glass-card styling', () => {
    const card = fixture.nativeElement.querySelector('.glass-card');
    expect(card).toBeTruthy();
  });
});
