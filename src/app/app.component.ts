import { Component, inject, ViewChild } from '@angular/core';
import { MoodBoardService } from './services/mood-board.service';
import { MoodBoardInputComponent } from './components/mood-board-input/mood-board-input.component';
import { ExamplePromptsComponent } from './components/example-prompts/example-prompts.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { MoodBoardDisplayComponent } from './components/mood-board-display/mood-board-display.component';
import { EXAMPLE_PROMPTS } from './constants/example-prompts.constant';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MoodBoardInputComponent,
    ExamplePromptsComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    MoodBoardDisplayComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  @ViewChild(MoodBoardInputComponent) inputComponent!: MoodBoardInputComponent;

  readonly moodBoardService = inject(MoodBoardService);
  readonly examplePrompts = EXAMPLE_PROMPTS;

  onSubmitPrompt(prompt: string): void {
    this.moodBoardService.generateMoodBoard(prompt);
  }

  onSelectExample(prompt: string): void {
    this.inputComponent.setPrompt(prompt);
  }

  onRetry(): void {
    this.moodBoardService.retry();
  }

  onDismissError(): void {
    this.moodBoardService.dismissError();
  }

  onNewMoodBoard(): void {
    this.moodBoardService.reset();
  }
}
