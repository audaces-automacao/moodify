import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { BoardCardComponent } from './board-card.component';
import { SavedMoodBoard } from '../models/mood-board.model';

describe('BoardCardComponent', () => {
  let component: BoardCardComponent;
  let fixture: ComponentFixture<BoardCardComponent>;

  const mockBoard: SavedMoodBoard = {
    id: 'test-id-1',
    name: 'Summer Vibes',
    prompt: 'bohemian summer style',
    moodBoard: {
      colorPalette: [
        { name: 'Coral', hex: '#FF6B6B', usage: 'primary' },
        { name: 'Sand', hex: '#F4E4C1', usage: 'secondary' },
        { name: 'Ocean', hex: '#4ECDC4', usage: 'accent' },
        { name: 'White', hex: '#FFFFFF', usage: 'neutral' },
        { name: 'Gold', hex: '#FFD93D', usage: 'highlight' },
      ],
      fabrics: [
        { name: 'Linen', description: 'Light and airy', texture: 'Soft', season: 'Summer' },
      ],
      styleKeywords: ['bohemian', 'relaxed', 'natural', 'earthy'],
      outfitSuggestions: {
        top: 'Flowy blouse',
        bottom: 'Wide leg pants',
        shoes: 'Sandals',
        accessories: ['Straw bag'],
      },
      aestheticDescription: 'A breezy, bohemian look perfect for summer adventures.',
    },
    outfitImageUrl: 'https://example.com/image.png',
    isFavorite: false,
    createdAt: '2024-06-15T10:30:00.000Z',
    updatedAt: '2024-06-15T10:30:00.000Z',
  };

  const translations = {
    library: {
      card: {
        favorite: 'Add to favorites',
        unfavorite: 'Remove from favorites',
        delete: 'Delete',
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BoardCardComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: translations },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('board', mockBoard);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display board name', () => {
    const title = fixture.nativeElement.querySelector('h3');
    expect(title.textContent).toContain('Summer Vibes');
  });

  it('should render color palette strip', () => {
    const colorStrips = fixture.nativeElement.querySelectorAll('.flex.h-3 > div');
    expect(colorStrips.length).toBe(5);
    expect(colorStrips[0].style.backgroundColor).toBe('rgb(255, 107, 107)');
  });

  it('should display first 3 style keywords', () => {
    const tags = fixture.nativeElement.querySelectorAll('.bg-luxury-onyx');
    expect(tags.length).toBe(3);
    expect(tags[0].textContent).toContain('bohemian');
    expect(tags[1].textContent).toContain('relaxed');
    expect(tags[2].textContent).toContain('natural');
  });

  it('should show +N indicator for additional keywords', () => {
    const moreIndicator = fixture.nativeElement.querySelector(
      '.text-luxury-silver:not(.bg-luxury-onyx)',
    );
    expect(moreIndicator.textContent).toContain('+1');
  });

  it('should display aesthetic description', () => {
    const description = fixture.nativeElement.querySelector('.italic');
    expect(description.textContent).toContain('bohemian look perfect for summer');
  });

  it('should display formatted date', () => {
    const date = fixture.nativeElement.querySelector('.text-luxury-silver\\/70');
    expect(date.textContent).toBeTruthy();
  });

  it('should show outline heart when not favorite', () => {
    const heartButton = fixture.nativeElement.querySelector('[aria-label="Add to favorites"]');
    expect(heartButton).toBeTruthy();
  });

  it('should show filled heart when favorite', () => {
    fixture.componentRef.setInput('board', { ...mockBoard, isFavorite: true });
    fixture.detectChanges();

    const heartButton = fixture.nativeElement.querySelector('[aria-label="Remove from favorites"]');
    expect(heartButton).toBeTruthy();
  });

  it('should emit view event when card is clicked', () => {
    const spy = jasmine.createSpy('viewSpy');
    component.view.subscribe(spy);

    const article = fixture.nativeElement.querySelector('article');
    article.click();

    expect(spy).toHaveBeenCalledWith(mockBoard);
  });

  it('should emit favorite event when heart is clicked without propagating', () => {
    const viewSpy = jasmine.createSpy('viewSpy');
    const favoriteSpy = jasmine.createSpy('favoriteSpy');
    component.view.subscribe(viewSpy);
    component.favorite.subscribe(favoriteSpy);

    const heartButton = fixture.nativeElement.querySelector('[aria-label="Add to favorites"]');
    heartButton.click();

    expect(favoriteSpy).toHaveBeenCalledWith('test-id-1');
    expect(viewSpy).not.toHaveBeenCalled();
  });

  it('should emit delete event when delete button is clicked without propagating', () => {
    const viewSpy = jasmine.createSpy('viewSpy');
    const deleteSpy = jasmine.createSpy('deleteSpy');
    component.view.subscribe(viewSpy);
    component.delete.subscribe(deleteSpy);

    const deleteButton = fixture.nativeElement.querySelector('.text-luxury-rose\\/70');
    deleteButton.click();

    expect(deleteSpy).toHaveBeenCalledWith('test-id-1');
    expect(viewSpy).not.toHaveBeenCalled();
  });

  it('should format date correctly', () => {
    const formatted = component.formatDate('2024-06-15T10:30:00.000Z');
    expect(formatted).toBeTruthy();
  });
});
