import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { asyncScheduler, filter, observeOn } from 'rxjs';
import { HeaderComponent } from './components/header.component';
import { LoadingSkeletonComponent } from './components/loading-skeleton.component';
import { MoodBoardComponent } from './components/mood-board.component';
import { ExamplePrompt, MoodInputComponent } from './components/mood-input.component';
import { MoodBoardResponse } from './models/mood-board.model';
import { OpenAIService } from './services/openai.service';

@Component({
  selector: 'app-root',
  imports: [
    TranslocoPipe,
    HeaderComponent,
    MoodInputComponent,
    LoadingSkeletonComponent,
    MoodBoardComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private openai = inject(OpenAIService);
  private transloco = inject(TranslocoService);
  private document = inject(DOCUMENT);
  private destroyRef = inject(DestroyRef);

  moodBoard = signal<MoodBoardResponse | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  examplePrompts = signal<ExamplePrompt[]>([]);

  private exampleKeys = ['parisian', 'coastal', '90s', 'darkAcademia', 'disco'] as const;

  ngOnInit() {
    // Defer signal updates outside Angular's render cycle to avoid change detection issues
    this.transloco.events$
      .pipe(
        filter((e) => e.type === 'translationLoadSuccess'),
        observeOn(asyncScheduler),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.updateExamplePrompts());

    this.transloco.langChanges$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((lang) => (this.document.documentElement.lang = lang));
  }

  private updateExamplePrompts() {
    this.examplePrompts.set(
      this.exampleKeys.map((key) => ({
        key,
        text: this.transloco.translate(`examples.${key}`),
      })),
    );
  }

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
