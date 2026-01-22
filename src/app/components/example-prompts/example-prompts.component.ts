import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExamplePrompt } from '../../models/mood-board.model';

@Component({
  selector: 'app-example-prompts',
  standalone: true,
  template: `
    <div class="mt-6">
      <p class="text-sm text-neutral-500 mb-3 text-center">Or try an example:</p>
      <div class="flex flex-wrap justify-center gap-2">
        @for (example of prompts; track example.id) {
          <button
            (click)="onSelect(example.prompt)"
            [disabled]="disabled"
            class="style-tag disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ example.label }}
          </button>
        }
      </div>
    </div>
  `
})
export class ExamplePromptsComponent {
  @Input() prompts: ExamplePrompt[] = [];
  @Input() disabled = false;
  @Output() selectPrompt = new EventEmitter<string>();

  onSelect(prompt: string): void {
    this.selectPrompt.emit(prompt);
  }
}
