import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoEvents, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
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

  // Reactive state with signals
  moodBoard = signal<MoodBoardResponse | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Example prompts keys for translation
  private exampleKeys = ['parisian', 'coastal', '90s', 'darkAcademia', 'disco'] as const;

  // Example prompts signal that updates when language changes
  examplePrompts = signal<ExamplePrompt[]>([]);

  ngOnInit() {
    // Wait for translations to load before accessing them
    // Use observeOn(asyncScheduler) to defer signal updates outside Angular's render cycle
    this.transloco.events$
      .pipe(
        filter((e): e is TranslocoEvents => e.type === 'translationLoadSuccess'),
        observeOn(asyncScheduler),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.updateExamplePrompts();
      });

    // Update document lang attribute when language changes
    this.transloco.langChanges$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((lang) => {
      this.updateDocumentLang(lang);
    });
  }

  private updateExamplePrompts() {
    const prompts = this.exampleKeys.map((key) => ({
      key,
      text: this.transloco.translate(`examples.${key}`),
    }));
    this.examplePrompts.set(prompts);
  }

  private updateDocumentLang(lang: string) {
    this.document.documentElement.lang = lang;
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
