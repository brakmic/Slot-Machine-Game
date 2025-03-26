import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Subject, finalize, takeUntil, tap } from 'rxjs';
import { SpinWinApiService } from '../../services/spin-win-api.service';
import { SoundService } from '../../services/sound.service';
import { Player } from '../../models/player.model';
import { SpinOutcome, SpinResult } from '../../models/spin-result.model';
import { SlotReelComponent } from '../slot-reel/slot-reel.component';

@Component({
  selector: 'spin-win-slot-machine',
  standalone: true,
  imports: [CommonModule, FormsModule, SlotReelComponent],
  templateUrl: './slot-machine.component.html',
  styleUrl: './slot-machine.component.scss',
})
export class SlotMachineComponent implements OnInit, OnDestroy {
  private apiService = inject(SpinWinApiService);
  private soundService = inject(SoundService);
  private destroy$ = new Subject<void>();
  
  // Using a temporary player ID for now - would be replaced with authentication
  playerId = 1;
  
  playerSubject = new BehaviorSubject<Player | null>(null);
  player$ = this.playerSubject.asObservable();
  
  betAmount: number = 10;
  minBet: number = 1;
  maxBet: number = 100;
  
  spinning = false;
  lastSpinResult: SpinResult | null = null;
  spinMessage = '';
  messageClass = '';
  
  // Sound state
  soundMuted$ = this.soundService.muted$;
  
  // Arrays of symbols for each reel
  reels: string[][] = [
    ['🍋', '🍊', '🍇', '🍒', '🔔', '💰', '7️⃣'],
    ['🍒', '🍊', '🍋', '🔔', '🍇', '💰', '7️⃣'],
    ['🍇', '🍒', '🍊', '🍋', '💰', '🔔', '7️⃣']
  ];
  
  // Visible symbols (3x3 grid for the slot machine display)
  visibleSymbols: string[][] = [
    ['?', '?', '?'],
    ['?', '?', '?'],
    ['?', '?', '?']
  ];
  
  // Final symbols from the spin result
  spinResult: string[] = [];
  
  // Particle effect control
  showWinEffect = false;
  
  // Light effects
  lightEffects = false;

  ngOnInit(): void {
    this.loadPlayer();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadPlayer(): void {
    this.apiService.getPlayer(this.playerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (player) => {
          this.playerSubject.next(player);
        },
        error: (error) => {
          console.error('Error loading player:', error);
          this.spinMessage = 'Failed to load player data';
          this.messageClass = 'error';
        }
      });
  }
  
  toggleSound(): void {
    this.soundService.toggleMute();
  }
  
  increaseBet(): void {
    if (this.betAmount < this.maxBet) {
      this.betAmount += 5;
      this.soundService.playSound('buttonClick');
    }
  }
  
  decreaseBet(): void {
    if (this.betAmount > this.minBet) {
      this.betAmount -= 5;
      this.soundService.playSound('buttonClick');
    }
  }
  
  maxBetClick(): void {
    this.betAmount = this.maxBet;
    this.soundService.playSound('buttonClick');
  }
  
  spin(): void {
    if (this.spinning) return;
    
    const player = this.playerSubject.value;
    if (!player) return;
    
    // Check if player has enough balance
    if (player.balance < this.betAmount) {
      this.spinMessage = 'Insufficient balance! Please add more funds.';
      this.messageClass = 'error';
      return;
    }
    
    // Start spinning
    this.spinning = true;
    this.spinMessage = '';
    this.messageClass = '';
    this.soundService.playSound('spin');
    
    // Start visual spinning animation
    this.startSpinAnimation();
    
    // Execute spin in backend
    this.apiService.executeSpin(this.playerId, this.betAmount)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          // This will run after the response (success or error)
          setTimeout(() => {
            this.stopSpinAnimation();
          }, 2000); // Stop after 2 seconds of animation
        })
      )
      .subscribe({
        next: (result) => {
          // Store result but don't update UI yet - animation is still playing
          this.lastSpinResult = result;
          this.spinResult = result.symbols;
          
          // Update player balance - optimistic update
          const player = this.playerSubject.value;
          if (player) {
            // First deduct the bet amount
            const updatedBalance = player.balance - this.betAmount + result.winnings;
            this.playerSubject.next({
              ...player,
              balance: updatedBalance
            });
          }
        },
        error: (error) => {
          console.error('Error executing spin:', error);
          this.spinMessage = 'Error occurred while spinning';
          this.messageClass = 'error';
          this.spinning = false;
        }
      });
  }
  
  private startSpinAnimation(): void {
    // Reset previous results
    this.showWinEffect = false;
    this.lightEffects = false;
    
    // Initialize with random symbols
    this.visibleSymbols = this.reels.map(reel => 
      Array.from({ length: 3 }, () => {
        const randomIndex = Math.floor(Math.random() * reel.length);
        return reel[randomIndex];
      })
    );
  }
  
  private stopSpinAnimation(): void {
    if (!this.lastSpinResult) {
      this.spinning = false;
      return;
    }
    
    // Update visibleSymbols with the real result
    const result = this.lastSpinResult;
    
    // Middle row shows the actual result
    this.visibleSymbols = this.visibleSymbols.map((reelSymbols, i) => {
      reelSymbols[1] = result.symbols[i] || '❓'; // Middle row
      return reelSymbols;
    });
    
    // Process win/loss and display appropriate message
    if (result.outcome !== SpinOutcome.LOSS) {
      this.handleWin(result);
    } else {
      this.handleLoss();
    }
    
    this.spinning = false;
  }
  
  private handleWin(result: SpinResult): void {
    // Display win message
    this.spinMessage = `You won ${result.winnings}!`;
    this.messageClass = 'win';
    
    // Visual and sound effects based on outcome
    switch (result.outcome) {
      case SpinOutcome.JACKPOT:
        this.soundService.playSound('jackpot');
        this.lightEffects = true;
        this.showWinEffect = true;
        break;
      case SpinOutcome.BIG_WIN:
      case SpinOutcome.WIN:
        this.soundService.playSound('win');
        this.showWinEffect = true;
        break;
      default:
        this.soundService.playSound('win');
    }
  }
  
  private handleLoss(): void {
    this.spinMessage = 'Better luck next time!';
    this.messageClass = 'loss';
    this.soundService.playSound('loss');
  }
}
