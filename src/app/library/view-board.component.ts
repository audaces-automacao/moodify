import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { HeaderComponent } from '../components/header.component';
import { MoodBoardComponent } from '../components/mood-board.component';
import { MoodBoardStorageService } from '../services/mood-board-storage.service';
import { SavedMoodBoard } from '../models/mood-board.model';

@Component({
  selector: 'app-view-board',
  imports: [RouterLink, TranslocoPipe, HeaderComponent, MoodBoardComponent],
  templateUrl: './view-board.component.html',
})
export class ViewBoardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private storage = inject(MoodBoardStorageService);

  board = signal<SavedMoodBoard | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.storage.getById(id);
      if (found) {
        this.board.set(found);
      } else {
        this.router.navigate(['/library']);
      }
    } else {
      this.router.navigate(['/library']);
    }
  }

  onToggleFavorite(): void {
    const current = this.board();
    if (current) {
      this.storage.toggleFavorite(current.id);
      this.board.set(this.storage.getById(current.id) ?? null);
    }
  }

  formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString();
  }
}
