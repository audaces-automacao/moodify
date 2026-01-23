import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { MoodInputComponent, ExamplePrompt } from './mood-input.component';

describe('MoodInputComponent', () => {
  let component: MoodInputComponent;
  let fixture: ComponentFixture<MoodInputComponent>;

  const mockExamples: ExamplePrompt[] = [
    { key: 'parisian', text: 'Parisian chic' },
    { key: 'coastal', text: 'Coastal grandmother' },
  ];

  const translations = {
    moodInput: {
      label: 'Describe Your Style',
      placeholder: 'Enter your mood...',
      generateButton: 'Generate Mood Board',
      generatingButton: 'Generating...',
      examplesTitle: 'Try an Example',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MoodInputComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: translations },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MoodInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct default values', () => {
    expect(component.examples()).toEqual([]);
    expect(component.isLoading()).toBe(false);
    expect(component.inputValue()).toBe('');
  });

  it('should render form elements with translated text', () => {
    const label = fixture.nativeElement.querySelector('label');
    const textarea = fixture.nativeElement.querySelector('textarea');
    const button = fixture.nativeElement.querySelector('button');

    expect(label.textContent).toContain('Describe Your Style');
    expect(textarea).toBeTruthy();
    expect(textarea.getAttribute('placeholder')).toBe('Enter your mood...');
    expect(button.textContent).toContain('Generate Mood Board');
  });

  it('should update inputValue signal on input event', () => {
    const textarea = fixture.nativeElement.querySelector('textarea');
    textarea.value = 'New style description';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.inputValue()).toBe('New style description');
  });

  it('should disable button when input is empty', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(true);
  });

  it('should enable button when input has value', () => {
    component.inputValue.set('Test prompt');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(false);
  });

  it('should disable button when isLoading is true', () => {
    fixture.componentRef.setInput('isLoading', true);
    component.inputValue.set('Test prompt');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(true);
  });

  it('should show generating text when loading', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('Generating...');
  });

  it('should emit generate event on button click', () => {
    const spy = jasmine.createSpy('generateSpy');
    component.generate.subscribe(spy);

    component.inputValue.set('Test prompt');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(spy).toHaveBeenCalledWith('Test prompt');
  });

  it('should not emit generate event when input is whitespace only', () => {
    const spy = jasmine.createSpy('generateSpy');
    component.generate.subscribe(spy);

    component.inputValue.set('   ');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should not emit generate event when loading', () => {
    const spy = jasmine.createSpy('generateSpy');
    component.generate.subscribe(spy);

    fixture.componentRef.setInput('isLoading', true);
    component.inputValue.set('Test prompt');
    fixture.detectChanges();

    // Call onSubmit directly since button is disabled
    const event = new Event('submit');
    spyOn(event, 'preventDefault');
    component.onSubmit(event);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should render example buttons with text when examples provided', () => {
    fixture.componentRef.setInput('examples', mockExamples);
    fixture.detectChanges();

    const exampleButtons = fixture.nativeElement.querySelectorAll('.glass-btn-secondary');
    const html = fixture.nativeElement.innerHTML;

    expect(exampleButtons.length).toBe(2);
    expect(html).toContain('Parisian chic');
    expect(html).toContain('Coastal grandmother');
  });

  it('should set inputValue when clicking example or calling selectExample', () => {
    fixture.componentRef.setInput('examples', mockExamples);
    fixture.detectChanges();

    const exampleButton = fixture.nativeElement.querySelector('.glass-btn-secondary');
    exampleButton.click();
    fixture.detectChanges();
    expect(component.inputValue()).toBe('Parisian chic');

    component.selectExample('Test example');
    expect(component.inputValue()).toBe('Test example');
  });

  it('should emit on Enter key press', () => {
    const spy = jasmine.createSpy('generateSpy');
    component.generate.subscribe(spy);

    component.inputValue.set('Enter test');
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector('textarea');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    spyOn(event, 'preventDefault');
    textarea.dispatchEvent(event);

    expect(spy).toHaveBeenCalledWith('Enter test');
  });

  it('should render examples title', () => {
    fixture.componentRef.setInput('examples', mockExamples);
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.mt-8 span');
    expect(title.textContent).toContain('Try an Example');
  });
});
