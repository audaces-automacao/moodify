import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { OutfitImageComponent } from './outfit-image.component';

describe('OutfitImageComponent', () => {
  let component: OutfitImageComponent;
  let fixture: ComponentFixture<OutfitImageComponent>;

  const translations = {
    outfitImage: {
      title: 'Outfit Visualization',
      altText: 'AI-generated outfit visualization',
      disclaimer: 'AI-generated image for inspiration purposes',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OutfitImageComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: translations },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OutfitImageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('imageUrl', 'https://example.com/image.png');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render section title', () => {
    fixture.componentRef.setInput('imageUrl', 'https://example.com/image.png');
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('h3');
    expect(title.textContent).toContain('Outfit Visualization');
  });

  it('should render image with correct src', () => {
    const testUrl = 'https://example.com/test-image.png';
    fixture.componentRef.setInput('imageUrl', testUrl);
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');
    expect(img.src).toBe(testUrl);
  });

  it('should render image with correct alt text', () => {
    fixture.componentRef.setInput('imageUrl', 'https://example.com/image.png');
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');
    expect(img.alt).toBe('AI-generated outfit visualization');
  });

  it('should render disclaimer text', () => {
    fixture.componentRef.setInput('imageUrl', 'https://example.com/image.png');
    fixture.detectChanges();

    const disclaimer = fixture.nativeElement.querySelector('p.italic');
    expect(disclaimer.textContent).toContain('AI-generated image for inspiration purposes');
  });

  it('should have fade-in animation', () => {
    fixture.componentRef.setInput('imageUrl', 'https://example.com/image.png');
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section');
    expect(section.classList.contains('animate-fade-in')).toBe(true);
  });

  it('should have lazy loading on image', () => {
    fixture.componentRef.setInput('imageUrl', 'https://example.com/image.png');
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');
    expect(img.getAttribute('loading')).toBe('lazy');
  });
});
