import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { OutfitGridComponent } from './outfit-grid.component';
import { OutfitSuggestion } from '../models/mood-board.model';

describe('OutfitGridComponent', () => {
  let component: OutfitGridComponent;
  let fixture: ComponentFixture<OutfitGridComponent>;

  const mockOutfitWithOuterwear: OutfitSuggestion = {
    top: 'Silk blouse in champagne',
    bottom: 'High-waisted trousers',
    shoes: 'Pointed-toe pumps',
    accessories: ['Gold watch', 'Pearl earrings'],
    outerwear: 'Tailored wool coat',
  };

  const mockOutfitWithoutOuterwear: OutfitSuggestion = {
    top: 'Linen shirt',
    bottom: 'Cotton shorts',
    shoes: 'Leather sandals',
    accessories: ['Straw hat'],
  };

  const mockOutfitNoAccessories: OutfitSuggestion = {
    top: 'Simple t-shirt',
    bottom: 'Jeans',
    shoes: 'Sneakers',
    accessories: [],
  };

  const translations = {
    outfits: {
      title: 'Outfit Suggestions',
      top: 'Top',
      bottom: 'Bottom',
      shoes: 'Shoes',
      outerwear: 'Outerwear',
      accessories: 'Accessories',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OutfitGridComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: translations },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OutfitGridComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('outfit', mockOutfitWithOuterwear);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render section title', () => {
    fixture.componentRef.setInput('outfit', mockOutfitWithOuterwear);
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('h3');
    expect(title.textContent).toContain('Outfit Suggestions');
  });

  it('should display all outfit items including outerwear when present', () => {
    fixture.componentRef.setInput('outfit', mockOutfitWithOuterwear);
    fixture.detectChanges();

    const html = fixture.nativeElement.innerHTML;
    expect(html).toContain('Silk blouse in champagne');
    expect(html).toContain('High-waisted trousers');
    expect(html).toContain('Pointed-toe pumps');
    expect(html).toContain('Tailored wool coat');
    expect(html).toContain('Outerwear');
  });

  it('should not display outerwear section when not present', () => {
    fixture.componentRef.setInput('outfit', mockOutfitWithoutOuterwear);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.grid .glass-card-hover');
    expect(cards.length).toBe(3); // top, bottom, shoes only
  });

  it('should display accessories when present with correct count', () => {
    fixture.componentRef.setInput('outfit', mockOutfitWithOuterwear);
    fixture.detectChanges();

    const html = fixture.nativeElement.innerHTML;
    const accessoryItems = fixture.nativeElement.querySelectorAll(
      '.mt-6 .flex.flex-wrap.gap-3 span',
    );

    expect(html).toContain('Gold watch');
    expect(html).toContain('Pearl earrings');
    expect(accessoryItems.length).toBe(2);
  });

  it('should not display accessories section when empty', () => {
    fixture.componentRef.setInput('outfit', mockOutfitNoAccessories);
    fixture.detectChanges();

    const accessoriesSection = fixture.nativeElement.querySelector('.mt-6.glass-card');
    expect(accessoriesSection).toBeFalsy();
  });

  it('should render 4 grid cards when outerwear is present', () => {
    fixture.componentRef.setInput('outfit', mockOutfitWithOuterwear);
    fixture.detectChanges();

    const gridCards = fixture.nativeElement.querySelectorAll('.grid .glass-card-hover');
    expect(gridCards.length).toBe(4);
  });
});
