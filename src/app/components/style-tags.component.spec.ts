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
    mockTags.forEach(tag => {
      expect(html).toContain(tag);
    });
  });

  it('should render section title', () => {
    const title = fixture.nativeElement.querySelector('h3');
    expect(title.textContent).toContain('Style Keywords');
  });

  describe('styledTags', () => {
    it('should pair each tag with the correct style', () => {
      const styled = component.styledTags();
      expect(styled[0]).toEqual({ tag: 'Elegant', style: 'bg-luxury-champagne text-luxury-void' });
      expect(styled[1]).toEqual({
        tag: 'Sophisticated',
        style: 'border border-luxury-champagne text-luxury-champagne',
      });
      expect(styled[2]).toEqual({ tag: 'Modern', style: 'bg-luxury-onyx text-luxury-cream' });
      expect(styled[3]).toEqual({
        tag: 'Minimalist',
        style: 'border border-luxury-graphite text-luxury-cream',
      });
    });

    it('should cycle styles when tags exceed style count', () => {
      const manyTags = Array.from({ length: 10 }, (_, i) => `Tag${i}`);
      fixture.componentRef.setInput('tags', manyTags);
      fixture.detectChanges();

      const styled = component.styledTags();
      expect(styled[8].style).toBe(styled[0].style);
      expect(styled[9].style).toBe(styled[1].style);
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
