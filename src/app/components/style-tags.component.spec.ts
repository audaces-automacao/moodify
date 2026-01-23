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
    it('should return first style for index 0', () => {
      expect(component.getTagStyle(0)).toBe('bg-luxury-champagne text-luxury-void');
    });

    it('should return second style for index 1', () => {
      expect(component.getTagStyle(1)).toBe('border border-luxury-champagne text-luxury-champagne');
    });

    it('should return third style for index 2', () => {
      expect(component.getTagStyle(2)).toBe('bg-luxury-onyx text-luxury-cream');
    });

    it('should return fourth style for index 3', () => {
      expect(component.getTagStyle(3)).toBe('border border-luxury-graphite text-luxury-cream');
    });

    it('should cycle through styles (index 8 should equal index 0)', () => {
      expect(component.getTagStyle(8)).toBe(component.getTagStyle(0));
    });

    it('should cycle through styles (index 9 should equal index 1)', () => {
      expect(component.getTagStyle(9)).toBe(component.getTagStyle(1));
    });

    it('should return all 8 unique styles', () => {
      const styles = Array.from({ length: 8 }, (_, i) => component.getTagStyle(i));
      const uniqueStyles = new Set(styles);
      expect(uniqueStyles.size).toBe(8);
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
