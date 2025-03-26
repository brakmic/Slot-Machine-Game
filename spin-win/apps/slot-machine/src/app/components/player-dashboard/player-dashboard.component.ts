import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinWinApiService } from '../../services/spin-win-api.service';
import { Player } from '../../models/player.model';
import { BehaviorSubject, catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'spin-win-player-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-dashboard.component.html',
  styleUrl: './player-dashboard.component.scss',
})
export class PlayerDashboardComponent implements OnInit {
  private apiService = inject(SpinWinApiService);
  
  playerSubject = new BehaviorSubject<Player | null>(null);
  player$ = this.playerSubject.asObservable();
  
  depositAmount: number = 100;
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  // TODO: In a real app, this would come from authentication
  private playerId = 1;
  
  ngOnInit(): void {
    this.loadPlayer();
  }
  
  private loadPlayer(): void {
    this.loading = true;
    this.apiService.getPlayer(this.playerId).pipe(
      tap(player => this.playerSubject.next(player)),
      catchError(error => {
        console.error('Error loading player:', error);
        this.errorMessage = 'Unable to load player data. Please try again.';
        return of(null);
      }),
      finalize(() => this.loading = false)
    ).subscribe();
  }
  
  deposit(): void {
    if (this.loading || this.depositAmount <= 0) return;
    
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.apiService.depositMoney(this.playerId, this.depositAmount).pipe(
      tap(updatedPlayer => {
        this.playerSubject.next(updatedPlayer);
        this.successMessage = `$${this.depositAmount} successfully added to your balance!`;
        this.depositAmount = 100; // Reset to default
      }),
      catchError(error => {
        console.error('Error depositing funds:', error);
        this.errorMessage = 'Unable to deposit funds. Please try again.';
        return of(null);
      }),
      finalize(() => this.loading = false)
    ).subscribe();
  }
  
  increaseDeposit(): void {
    this.depositAmount += 100;
  }
  
  decreaseDeposit(): void {
    if (this.depositAmount > 100) {
      this.depositAmount -= 100;
    }
  }
}
