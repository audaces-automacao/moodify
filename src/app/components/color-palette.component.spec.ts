import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { ColorSwatch } from '../models/mood-board.model';
import { ColorPaletteComponent } from './color-palette.component';

describe('ColorPaletteComponent', () => {
  let component: ColorPaletteComponent;
  let fixture: ComponentFixture<ColorPaletteComponent>;

  const mockColors: ColorSwatch[] = [
    { name: 'Midnight Blue', hex: '#1a1a2e', usage: 'primary' },
    { name: 'Gold Accent', hex: '#c9a961', usage: 'accent' },
    { name: 'Soft Cream', hex: '#f5f5dc', usage: 'neutral' },
  ];

  const translations = {
    colorPalette: { title: 'Color Palette' },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ColorPaletteComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: translations },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorPaletteComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('colors', mockColors);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render section title', () => {
    const title = fixture.nativeElement.querySelector('h3');
    expect(title.textContent).toContain('Color Palette');
  });

  it('should render all color swatches', () => {
    const swatches = fixture.nativeElement.querySelectorAll('.group');
    expect(swatches.length).toBe(3);
  });

  it('should display color names, hex codes, and usage labels', () => {
    const html = fixture.nativeElement.innerHTML;
    mockColors.forEach((color) => {
      expect(html).toContain(color.name);
      expect(html).toContain(color.hex);
      expect(html).toContain(color.usage);
    });
  });

  it('should apply background color and title attribute to swatches', () => {
    const swatch = fixture.nativeElement.querySelector('[style*="background-color"]');
    const swatchWithTitle = fixture.nativeElement.querySelector('[title]');

    expect(swatch).toBeTruthy();
    expect(swatchWithTitle.getAttribute('title')).toContain('Midnight Blue');
    expect(swatchWithTitle.getAttribute('title')).toContain('primary');
  });

  it('should handle empty colors array', async () => {
    fixture.componentRef.setInput('colors', []);
    fixture.detectChanges();
    await fixture.whenStable();

    const swatches = fixture.nativeElement.querySelectorAll('.group');
    expect(swatches.length).toBe(0);
  });
});
