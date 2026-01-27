import { DOCUMENT } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
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
  private document = inject(DOCUMENT);
  private destroyRef = inject(DestroyRef);

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
    // Subscribe to translation changes - emits when translations are fully loaded
    // Handles both initial load and language switches
    this.transloco
      .selectTranslation()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.document.documentElement.lang = this.transloco.getActiveLang();
        this.updateExamplePrompts();
      });
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
    this.outfitImage.set(null);
    this.isImageLoading.set(false);
    this.imageError.set(null);

    // Scroll to loading section after DOM updates
    setTimeout(() => this.scrollToLoading(), 100);

    this.openai.generateMoodBoard(prompt).subscribe({
      next: (result) => {
        this.moodBoard.set(result);
        this.isLoading.set(false);
        this.generateOutfitImage(result);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      },
    });
  }

  private generateOutfitImage(moodBoard: MoodBoardResponse) {
    this.isImageLoading.set(true);
    this.imageError.set(null);

    this.openai
      .generateOutfitImage(moodBoard.outfitSuggestions, moodBoard.styleKeywords)
      .subscribe({
        next: (imageUrl) => {
          // Preload the image before displaying to avoid visual gap
          this.preloadImage(imageUrl).then(
            () => {
              this.outfitImage.set(imageUrl);
              this.isImageLoading.set(false);
            },
            () => {
              this.imageError.set(this.transloco.translate('errors.imageGenericError'));
              this.isImageLoading.set(false);
            },
          );
        },
        error: (err) => {
          this.imageError.set(err.message);
          this.isImageLoading.set(false);
        },
      });
  }

  private preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject();
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
