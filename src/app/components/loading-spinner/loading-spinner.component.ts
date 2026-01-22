import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div class="relative">
        <div class="w-16 h-16 border-4 border-neutral-800 rounded-full"></div>
        <div class="w-16 h-16 border-4 border-gold-400 border-t-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
      </div>
      <p class="mt-6 text-neutral-400 text-lg">{{ currentMessage }}</p>
      <p class="mt-2 text-neutral-600 text-sm">This may take a moment...</p>
    </div>
  `
})
export class LoadingSpinnerComponent implements OnInit, OnDestroy {
  @Input() messages: string[] = [
    'Analyzing your style...',
    'Curating color palettes...',
    'Selecting fabrics...',
    'Designing your outfit...',
    'Finalizing mood board...'
  ];

  currentMessage = '';
  private messageIndex = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.currentMessage = this.messages[0];
    this.intervalId = setInterval(() => {
      this.messageIndex = (this.messageIndex + 1) % this.messages.length;
      this.currentMessage = this.messages[this.messageIndex];
    }, 2500);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
