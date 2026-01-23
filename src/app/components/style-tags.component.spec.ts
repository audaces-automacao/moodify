import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { StyleTagsComponent } from './style-tags.component';

describe('StyleTagsComponent', () => {
  let component: StyleTagsComponent;
  let fixture: ComponentFixture<StyleTagsComponent>;

  const mockTags = ['Elegant', 'Sophisticated', 'Modern', 'Minimalist'];
  const translations = {
    styleTags: { title: 'Style Keywords' },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StyleTagsComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: translations },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StyleTagsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tags', mockTags);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all tags', () => {
    const tagElements = fixture.nativeElement.querySelectorAll('.px-4.py-2');
    expect(tagElements.length).toBe(4);
  });

  it('should display tag text', () => {
    const html = fixture.nativeElement.innerHTML;
    mockTags.forEach((tag) => {
      expect(html).toContain(tag);
    });
  });

  it('should render section title', () => {
    const title = fixture.nativeElement.querySelector('h3');
    expect(title.textContent).toContain('Style Keywords');
  });

  describe('getTagStyle', () => {
    it('should return correct styles for each index', () => {
      expect(component.getTagStyle(0)).toBe('bg-luxury-champagne text-luxury-void');
      expect(component.getTagStyle(1)).toBe('border border-luxury-champagne text-luxury-champagne');
      expect(component.getTagStyle(2)).toBe('bg-luxury-onyx text-luxury-cream');
      expect(component.getTagStyle(3)).toBe('border border-luxury-graphite text-luxury-cream');
    });

    it('should cycle through 8 unique styles', () => {
      const styles = Array.from({ length: 8 }, (_, i) => component.getTagStyle(i));
      const uniqueStyles = new Set(styles);

      expect(uniqueStyles.size).toBe(8);
      expect(component.getTagStyle(8)).toBe(component.getTagStyle(0));
      expect(component.getTagStyle(9)).toBe(component.getTagStyle(1));
    });
  });

  it('should handle empty tags array', async () => {
    fixture.componentRef.setInput('tags', []);
    fixture.detectChanges();
    await fixture.whenStable();

    const tagElements = fixture.nativeElement.querySelectorAll('.px-4.py-2');
    expect(tagElements.length).toBe(0);
  });
});
