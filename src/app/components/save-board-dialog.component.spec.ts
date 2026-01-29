import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { SaveBoardDialogComponent } from './save-board-dialog.component';

describe('SaveBoardDialogComponent', () => {
  let component: SaveBoardDialogComponent;
  let fixture: ComponentFixture<SaveBoardDialogComponent>;

  const translations = {
    library: {
      saveDialog: {
        title: 'Save Mood Board',
        nameLabel: 'Name',
        namePlaceholder: 'e.g., Summer Vacation Vibes',
        save: 'Save',
        cancel: 'Cancel',
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SaveBoardDialogComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: translations },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SaveBoardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty board name initially', () => {
    expect(component.boardName()).toBe('');
  });

  it('should render title and form elements with translated text', () => {
    const title = fixture.nativeElement.querySelector('h2');
    const label = fixture.nativeElement.querySelector('label');
    const input = fixture.nativeElement.querySelector('input');

    expect(title.textContent).toContain('Save Mood Board');
    expect(label.textContent).toContain('Name');
    expect(input.getAttribute('placeholder')).toBe('e.g., Summer Vacation Vibes');
  });

  it('should update boardName signal on input event', () => {
    const input = fixture.nativeElement.querySelector('input');
    input.value = 'My Mood Board';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.boardName()).toBe('My Mood Board');
  });

  it('should disable save button when name is empty', () => {
    const saveButton = fixture.nativeElement.querySelector('.glass-btn-primary');
    expect(saveButton.disabled).toBe(true);
  });

  it('should enable save button when name has value', () => {
    component.boardName.set('Test Board');
    fixture.detectChanges();

    const saveButton = fixture.nativeElement.querySelector('.glass-btn-primary');
    expect(saveButton.disabled).toBe(false);
  });

  it('should emit saved event with trimmed name when save button is clicked', () => {
    const spy = jasmine.createSpy('savedSpy');
    component.saved.subscribe(spy);

    component.boardName.set('  My Board  ');
    fixture.detectChanges();

    const saveButton = fixture.nativeElement.querySelector('.glass-btn-primary');
    saveButton.click();

    expect(spy).toHaveBeenCalledWith('My Board');
  });

  it('should not emit saved event when name is whitespace only', () => {
    const spy = jasmine.createSpy('savedSpy');
    component.saved.subscribe(spy);

    component.boardName.set('   ');
    component.onSave();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit dismissed event when cancel button is clicked', () => {
    const spy = jasmine.createSpy('dismissedSpy');
    component.dismissed.subscribe(spy);

    const cancelButton = fixture.nativeElement.querySelector('.glass-btn-secondary');
    cancelButton.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit dismissed event when backdrop is clicked', () => {
    const spy = jasmine.createSpy('dismissedSpy');
    component.dismissed.subscribe(spy);

    const backdrop = fixture.nativeElement.querySelector('button.fixed.inset-0');
    backdrop.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit saved event on Enter key press when name is valid', () => {
    const spy = jasmine.createSpy('savedSpy');
    component.saved.subscribe(spy);

    component.boardName.set('Enter Test');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    input.dispatchEvent(event);

    expect(spy).toHaveBeenCalledWith('Enter Test');
  });
});
