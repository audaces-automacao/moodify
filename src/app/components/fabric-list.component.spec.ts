import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { FabricListComponent } from './fabric-list.component';
import { FabricRecommendation } from '../models/mood-board.model';

describe('FabricListComponent', () => {
  let component: FabricListComponent;
  let fixture: ComponentFixture<FabricListComponent>;

  const mockFabrics: FabricRecommendation[] = [
    {
      name: 'Silk Charmeuse',
      description: 'Luxurious drape perfect for evening wear',
      texture: 'Smooth and flowing',
      season: 'Spring',
    },
    {
      name: 'Wool Tweed',
      description: 'Classic texture for structured pieces',
      texture: 'Textured and warm',
      season: 'Fall',
    },
  ];

  const translations = {
    fabrics: {
      title: 'Recommended Fabrics',
      textureLabel: 'Texture:',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FabricListComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: translations },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FabricListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('fabrics', mockFabrics);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render section title', () => {
    const title = fixture.nativeElement.querySelector('h3');
    expect(title.textContent).toContain('Recommended Fabrics');
  });

  it('should render all fabric cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('.glass-card-hover');
    expect(cards.length).toBe(2);
  });

  it('should display all fabric properties with texture label', () => {
    const html = fixture.nativeElement.innerHTML;

    mockFabrics.forEach((fabric) => {
      expect(html).toContain(fabric.name);
      expect(html).toContain(fabric.description);
      expect(html).toContain(fabric.texture);
      expect(html).toContain(fabric.season);
    });
    expect(html).toContain('Texture:');
  });

  it('should handle empty fabrics array', async () => {
    fixture.componentRef.setInput('fabrics', []);
    fixture.detectChanges();
    await fixture.whenStable();

    const cards = fixture.nativeElement.querySelectorAll('.glass-card-hover');
    expect(cards.length).toBe(0);
  });
});
