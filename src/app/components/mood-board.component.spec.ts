import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { MoodBoardComponent } from './mood-board.component';
import { MoodBoardResponse } from '../models/mood-board.model';

describe('MoodBoardComponent', () => {
  let component: MoodBoardComponent;
  let fixture: ComponentFixture<MoodBoardComponent>;

  const mockMoodBoard: MoodBoardResponse = {
    colorPalette: [
      { name: 'Midnight Blue', hex: '#1a1a2e', usage: 'primary' },
      { name: 'Gold', hex: '#c9a961', usage: 'accent' },
    ],
    fabrics: [
      {
        name: 'Silk',
        description: 'Luxurious',
        texture: 'Smooth',
        season: 'Spring',
      },
    ],
    styleKeywords: ['Elegant', 'Sophisticated'],
    outfitSuggestions: {
      top: 'Silk blouse',
      bottom: 'Trousers',
      shoes: 'Heels',
      accessories: ['Watch'],
    },
    aestheticDescription: 'A sophisticated and timeless look with elegant details.',
  };

  const translations = {
    moodBoard: { aestheticOverview: 'Aesthetic Overview' },
    colorPalette: { title: 'Color Palette' },
    styleTags: { title: 'Style Keywords' },
    fabrics: { title: 'Fabrics', textureLabel: 'Texture:' },
    outfits: {
      title: 'Outfit Suggestions',
      top: 'Top',
      bottom: 'Bottom',
      shoes: 'Shoes',
      accessories: 'Accessories',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MoodBoardComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: translations },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MoodBoardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', mockMoodBoard);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have fade-in animation', () => {
    const container = fixture.nativeElement.querySelector('.animate-fade-in');
    expect(container).toBeTruthy();
  });

  it('should display aesthetic overview title', () => {
    const title = fixture.nativeElement.querySelector('h3');
    expect(title.textContent).toContain('Aesthetic Overview');
  });

  it('should display aesthetic description', () => {
    const html = fixture.nativeElement.innerHTML;
    expect(html).toContain('A sophisticated and timeless look');
  });

  it('should render color palette component', () => {
    const colorPalette = fixture.nativeElement.querySelector('app-color-palette');
    expect(colorPalette).toBeTruthy();
  });

  it('should render style tags component', () => {
    const styleTags = fixture.nativeElement.querySelector('app-style-tags');
    expect(styleTags).toBeTruthy();
  });

  it('should render fabric list component', () => {
    const fabricList = fixture.nativeElement.querySelector('app-fabric-list');
    expect(fabricList).toBeTruthy();
  });

  it('should render outfit grid component', () => {
    const outfitGrid = fixture.nativeElement.querySelector('app-outfit-grid');
    expect(outfitGrid).toBeTruthy();
  });

  it('should pass correct data to child components', () => {
    expect(component.data()).toEqual(mockMoodBoard);
  });
});
