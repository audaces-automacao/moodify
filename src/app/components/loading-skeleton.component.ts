import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  template: `
    <div class="animate-pulse">
      <!-- Aesthetic Description Skeleton -->
      <div class="mb-12">
        <div class="h-4 w-32 bg-editorial-charcoal/20 mb-4"></div>
        <div class="space-y-3">
          <div class="h-4 bg-editorial-charcoal/20 w-full"></div>
          <div class="h-4 bg-editorial-charcoal/20 w-5/6"></div>
          <div class="h-4 bg-editorial-charcoal/20 w-4/6"></div>
        </div>
      </div>

      <!-- Color Palette Skeleton -->
      <div class="mb-12">
        <div class="h-4 w-32 bg-editorial-charcoal/20 mb-6"></div>
        <div class="flex flex-wrap gap-4">
          @for (i of [1, 2, 3, 4, 5, 6]; track i) {
            <div class="flex flex-col items-center gap-2">
              <div class="w-16 h-16 md:w-20 md:h-20 bg-editorial-charcoal/20"></div>
              <div class="h-3 w-16 bg-editorial-charcoal/20"></div>
            </div>
          }
        </div>
      </div>

      <!-- Style Tags Skeleton -->
      <div class="mb-12">
        <div class="h-4 w-32 bg-editorial-charcoal/20 mb-6"></div>
        <div class="flex flex-wrap gap-3">
          @for (i of [1, 2, 3, 4, 5, 6, 7]; track i) {
            <div
              class="h-8 bg-editorial-charcoal/20 rounded-none"
              [style.width.px]="60 + i * 15"
            ></div>
          }
        </div>
      </div>

      <!-- Fabrics Skeleton -->
      <div class="mb-12">
        <div class="h-4 w-32 bg-editorial-charcoal/20 mb-6"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          @for (i of [1, 2, 3, 4]; track i) {
            <div class="border-2 border-editorial-charcoal/20 p-6">
              <div class="h-5 w-24 bg-editorial-charcoal/20 mb-3"></div>
              <div class="space-y-2">
                <div class="h-3 bg-editorial-charcoal/20 w-full"></div>
                <div class="h-3 bg-editorial-charcoal/20 w-4/5"></div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Outfit Skeleton -->
      <div>
        <div class="h-4 w-32 bg-editorial-charcoal/20 mb-6"></div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          @for (i of [1, 2, 3, 4]; track i) {
            <div class="border-2 border-editorial-charcoal/20 p-4">
              <div class="h-3 w-12 bg-editorial-charcoal/20 mb-3"></div>
              <div class="space-y-2">
                <div class="h-3 bg-editorial-charcoal/20 w-full"></div>
                <div class="h-3 bg-editorial-charcoal/20 w-3/4"></div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class LoadingSkeletonComponent {}
