import { Component, input, output, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

export interface ExamplePrompt {
  key: string;
  text: string;
}

@Component({
  selector: 'app-mood-input',
  imports: [TranslocoPipe],
  template: `
    <div class="max-w-2xl mx-auto">
      <!-- Input Section -->
      <div class="glass-card p-8 rounded-lg">
        <label for="mood-prompt" class="text-uppercase block mb-4 text-luxury-silver">
          {{ 'moodInput.label' | transloco }}
        </label>
        <textarea
          id="mood-prompt"
          [value]="inputValue()"
          (input)="onInput($event)"
          (keydown.enter)="onSubmit($event)"
          [placeholder]="'moodInput.placeholder' | transloco"
          class="glass-input w-full h-32 p-4 font-sans text-lg text-luxury-cream
                 placeholder-luxury-silver/50 resize-none rounded-lg"
        ></textarea>
        <button
          (click)="onSubmit($event)"
          [disabled]="!inputValue().trim() || isLoading()"
          class="glass-btn-primary mt-4 w-full py-4 font-sans text-sm font-semibold
                 tracking-widest uppercase rounded-lg"
        >
          {{
            isLoading()
              ? ('moodInput.generatingButton' | transloco)
              : ('moodInput.generateButton' | transloco)
          }}
        </button>
      </div>

      <!-- Example Prompts -->
      <div class="mt-8">
        <span class="text-uppercase block mb-4 text-luxury-silver text-center">
          {{ 'moodInput.examplesTitle' | transloco }}
        </span>
        <div class="flex flex-wrap justify-center gap-3">
          @for (example of examples(); track example.key) {
            <button
              (click)="selectExample(example.text)"
              class="glass-btn-secondary px-4 py-2 text-sm font-sans rounded-full"
            >
              {{ example.text }}
            </button>
          }
        </div>
      </div>
    </div>
  `,
})
export class MoodInputComponent {
  examples = input<ExamplePrompt[]>([]);
  isLoading = input<boolean>(false);
  generate = output<string>();

  inputValue = signal('');

  onInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.inputValue.set(target.value);
  }

  selectExample(text: string) {
    this.inputValue.set(text);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const value = this.inputValue().trim();
    if (value && !this.isLoading()) {
      this.generate.emit(value);
    }
  }
}
