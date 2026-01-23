import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-mood-input',
  template: `
    <div class="max-w-2xl mx-auto">
      <!-- Input Section -->
      <div class="border-2 border-editorial-black bg-white p-8">
        <label for="mood-prompt" class="text-uppercase block mb-4 text-editorial-charcoal">
          Describe Your Style
        </label>
        <textarea
          id="mood-prompt"
          [value]="inputValue()"
          (input)="onInput($event)"
          (keydown.enter)="onSubmit($event)"
          placeholder="e.g., Parisian chic for a gallery opening..."
          class="w-full h-32 p-4 border-2 border-editorial-black font-sans text-lg resize-none
                 focus:outline-none focus:border-editorial-gold transition-colors"
        ></textarea>
        <button
          (click)="onSubmit($event)"
          [disabled]="!inputValue().trim() || isLoading()"
          class="mt-4 w-full py-4 bg-editorial-black text-editorial-white font-sans text-sm
                 tracking-widest uppercase transition-all
                 hover:bg-editorial-charcoal
                 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading() ? 'Generating...' : 'Generate Mood Board' }}
        </button>
      </div>

      <!-- Example Prompts -->
      <div class="mt-8">
        <span class="text-uppercase block mb-4 text-editorial-charcoal text-center">
          Try an Example
        </span>
        <div class="flex flex-wrap justify-center gap-3">
          @for (example of examples(); track example) {
            <button
              (click)="selectExample(example)"
              class="px-4 py-2 border border-editorial-charcoal text-sm font-sans
                     text-editorial-charcoal transition-all
                     hover:bg-editorial-black hover:text-editorial-white hover:border-editorial-black"
            >
              {{ example }}
            </button>
          }
        </div>
      </div>
    </div>
  `,
})
export class MoodInputComponent {
  examples = input<string[]>([]);
  isLoading = input<boolean>(false);
  generate = output<string>();

  inputValue = signal('');

  onInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.inputValue.set(target.value);
  }

  selectExample(example: string) {
    this.inputValue.set(example);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const value = this.inputValue().trim();
    if (value && !this.isLoading()) {
      this.generate.emit(value);
    }
  }
}
