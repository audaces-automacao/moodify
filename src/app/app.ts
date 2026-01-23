import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from './components/header.component';
import { MoodInputComponent } from './components/mood-input.component';
import { LoadingSkeletonComponent } from './components/loading-skeleton.component';
import { MoodBoardComponent } from './components/mood-board.component';
import { OpenAIService } from './services/openai.service';
import { MoodBoardResponse } from './models/mood-board.model';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, MoodInputComponent, LoadingSkeletonComponent, MoodBoardComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private openai = inject(OpenAIService);

  // Reactive state with signals
  moodBoard = signal<MoodBoardResponse | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Example prompts for clickable chips
  examplePrompts = [
    'Parisian chic for a gallery opening',
    'Coastal grandmother aesthetic for summer',
    '90s minimalism meets modern streetwear',
    'Dark academia for autumn',
    "Maximalist disco glam for New Year's Eve",
  ];

  generateMoodBoard(prompt: string) {
    this.isLoading.set(true);
    this.error.set(null);
    this.moodBoard.set(null);

    this.openai.generateMoodBoard(prompt).subscribe({
      next: (result) => {
        this.moodBoard.set(result);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      },
    });
  }
}
