import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSkeletonComponent } from './loading-skeleton.component';

describe('LoadingSkeletonComponent', () => {
  let component: LoadingSkeletonComponent;
  let fixture: ComponentFixture<LoadingSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have fade-in animation container', () => {
    const container = fixture.nativeElement.querySelector('.animate-fade-in');
    expect(container).toBeTruthy();
  });

  it('should render 6 color palette skeleton items', () => {
    const colorSection = fixture.nativeElement.querySelectorAll(
      '.flex.flex-wrap.gap-4 .flex.flex-col.items-center',
    );
    expect(colorSection.length).toBe(6);
  });

  it('should render 7 style tag skeleton items', () => {
    const tagSkeletons = fixture.nativeElement.querySelectorAll(
      '.flex.flex-wrap.gap-3 .skeleton-shimmer.rounded-full',
    );
    expect(tagSkeletons.length).toBe(7);
  });

  it('should render 4 fabric card skeletons', () => {
    const fabricCards = fixture.nativeElement.querySelectorAll(
      '.grid.grid-cols-1.md\\:grid-cols-2 .glass-card',
    );
    expect(fabricCards.length).toBe(4);
  });

  it('should render 4 outfit skeleton cards', () => {
    const outfitCards = fixture.nativeElement.querySelectorAll(
      '.grid.grid-cols-2.md\\:grid-cols-4 .glass-card',
    );
    expect(outfitCards.length).toBe(4);
  });

  it('should have skeleton shimmer elements', () => {
    const shimmerElements = fixture.nativeElement.querySelectorAll('.skeleton-shimmer');
    expect(shimmerElements.length).toBeGreaterThan(0);
  });
});
