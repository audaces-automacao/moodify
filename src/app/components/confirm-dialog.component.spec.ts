import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  const translations = {
    library: {
      confirmDialog: {
        cancel: 'Cancel',
        confirm: 'Delete',
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ConfirmDialogComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: translations },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Delete Board?');
    fixture.componentRef.setInput('message', 'Are you sure you want to delete this board?');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title and message', () => {
    const title = fixture.nativeElement.querySelector('h2');
    const message = fixture.nativeElement.querySelector('p');

    expect(title.textContent).toContain('Delete Board?');
    expect(message.textContent).toContain('Are you sure you want to delete this board?');
  });

  it('should render cancel and confirm buttons with translated text', () => {
    const cancelButton = fixture.nativeElement.querySelector('.glass-btn-secondary');
    const confirmButton = fixture.nativeElement.querySelector('.bg-luxury-rose');

    expect(cancelButton.textContent).toContain('Cancel');
    expect(confirmButton.textContent).toContain('Delete');
  });

  it('should emit dismissed event when cancel button is clicked', () => {
    const spy = jasmine.createSpy('dismissedSpy');
    component.dismissed.subscribe(spy);

    const cancelButton = fixture.nativeElement.querySelector('.glass-btn-secondary');
    cancelButton.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit confirmed event when confirm button is clicked', () => {
    const spy = jasmine.createSpy('confirmedSpy');
    component.confirmed.subscribe(spy);

    const confirmButton = fixture.nativeElement.querySelector('.bg-luxury-rose');
    confirmButton.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit dismissed event when backdrop is clicked', () => {
    const spy = jasmine.createSpy('dismissedSpy');
    component.dismissed.subscribe(spy);

    const backdrop = fixture.nativeElement.querySelector('button.fixed.inset-0');
    backdrop.click();

    expect(spy).toHaveBeenCalled();
  });
});
