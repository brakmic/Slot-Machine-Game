import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardEntry } from '../../models/leaderboard-entry.model';
import { SpinWinApiService } from '../../services/spin-win-api.service';
import { catchError, Observable, of, startWith, tap } from 'rxjs';

@Component({
  selector: 'spin-win-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaderboardComponent {
  private apiService = inject(SpinWinApiService);
  
  loading = false;
  error = '';
  
  topPlayers$: Observable<LeaderboardEntry[]> = this.loadLeaderboard();

  loadLeaderboard(): Observable<LeaderboardEntry[]> {
    this.loading = true;
    this.error = '';
    
    return this.apiService.getTopPlayers(10).pipe(
      tap(() => this.loading = false),
      catchError(error => {
        console.error('Error loading leaderboard:', error);
        this.error = 'Failed to load leaderboard. Please try again later.';
        this.loading = false;
        return of([] as LeaderboardEntry[]);
      })
    );
  }
  
  refreshLeaderboard(): void {
    this.topPlayers$ = this.loadLeaderboard();
  }
}
