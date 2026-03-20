import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { finalize, from, map, switchMap } from 'rxjs';
import { HeaderComponent } from './components/header.component';
import { LoadingSkeletonComponent } from './components/loading-skeleton.component';
import { MoodBoardComponent } from './components/mood-board.component';
import { ExamplePrompt, MoodInputComponent } from './components/mood-input.component';
import { MoodBoardResponse } from './models/mood-board.model';
import { OpenAIService } from './services/openai.service';

@Component({
  selector: 'app-home',
  imports: [
    TranslocoPipe,
    HeaderComponent,
    MoodInputComponent,
    LoadingSkeletonComponent,
    MoodBoardComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private openai = inject(OpenAIService);
  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);
  private injector = inject(Injector);

  @ViewChild('loadingSection') loadingSection!: ElementRef<HTMLDivElement>;

  moodBoard = signal<MoodBoardResponse | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  examplePrompts = signal<ExamplePrompt[]>([]);

  outfitImage = signal<string | null>(null);
  isImageLoading = signal(false);
  imageError = signal<string | null>(null);

  private exampleKeys = ['parisian', 'coastal', '90s', 'darkAcademia', 'disco'] as const;

  ngOnInit() {
    this.transloco
      .selectTranslation()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateExamplePrompts();
      });
  }

  private updateExamplePrompts() {
    this.examplePrompts.set(
      this.exampleKeys.map(key => ({
        key,
        text: this.transloco.translate(`examples.${key}`),
      }))
    );
  }

  generateMoodBoard(prompt: string) {
    this.resetState();

    afterNextRender(() => this.scrollToLoading(), { injector: this.injector });

    this.openai
      .generateMoodBoard(prompt)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: result => {
          this.moodBoard.set(result);
          this.generateOutfitImage(result);
        },
        error: err => this.error.set(err.message),
      });
  }

  private resetState() {
    this.isLoading.set(true);
    this.error.set(null);
    this.moodBoard.set(null);
    this.outfitImage.set(null);
    this.isImageLoading.set(false);
    this.imageError.set(null);
  }

  private generateOutfitImage(moodBoard: MoodBoardResponse) {
    this.isImageLoading.set(true);

    this.openai
      .generateOutfitImage(moodBoard.outfitSuggestions, moodBoard.styleKeywords)
      .pipe(
        switchMap(url => from(this.preloadImage(url)).pipe(map(() => url))),
        finalize(() => this.isImageLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: url => this.outfitImage.set(url),
        error: err => {
          const message = err?.message || this.transloco.translate('errors.imageGenericError');
          this.imageError.set(message);
        },
      });
  }

  private preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(this.transloco.translate('errors.imageGenericError')));
      img.src = url;
    });
  }

  private scrollToLoading() {
    this.loadingSection?.nativeElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
