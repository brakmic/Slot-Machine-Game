import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'spin-win-slot-reel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slot-reel.component.html',
  styleUrl: './slot-reel.component.scss',
  animations: [
    trigger('reelSpin', [
      transition('* => spin', [
        style({ transform: 'translateY(0)' }),
        animate('{{duration}}ms ease-out', 
          style({ transform: 'translateY(-{{distance}}px)' }))
      ])
    ])
  ]
})
export class SlotReelComponent implements OnChanges, AfterViewInit {
  @Input() symbols: string[] = [];
  @Input() finalSymbol: string = '';
  @Input() index: number = 0;
  @Input() spinning: boolean = false;
  @ViewChild('reelStrip') reelStrip!: ElementRef;

  animationState: string = 'idle';
  visibleSymbols: string[] = [];
  animationParams = { duration: 0, distance: 0 };
  
  // Extra symbols to create the illusion of infinite spinning
  private extraSymbols: string[] = ['🍒', '🍊', '🍋', '🍇', '🔔', '💰', '7️⃣', '📊', '⭐', '💎'];
  private readonly SYMBOL_HEIGHT = 100;
  private readonly MIN_SPIN_DURATION = 2000;
  private readonly MAX_SPIN_DURATION = 4000;

  constructor() {}

  ngAfterViewInit(): void {
    this.populateVisibleSymbols();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['spinning'] && this.spinning) {
      this.startSpin();
    } else if (changes['finalSymbol'] && !this.spinning && this.finalSymbol) {
      this.stopAtSymbol(this.finalSymbol);
    }
  }

  private populateVisibleSymbols(): void {
    // Generate initial random symbols + the final symbol at the end
    this.visibleSymbols = [...this.getRandomSymbols(20), this.finalSymbol];
  }

  private getRandomSymbols(count: number): string[] {
    return Array.from({ length: count }, () => {
      const randomIndex = Math.floor(Math.random() * this.extraSymbols.length);
      return this.extraSymbols[randomIndex];
    });
  }

  private startSpin(): void {
    if (!this.reelStrip) return;
    
    // Reset position
    this.reelStrip.nativeElement.style.transition = 'none';
    this.reelStrip.nativeElement.style.transform = 'translateY(0)';
    
    // Force layout recalculation
    void this.reelStrip.nativeElement.offsetHeight;
    
    // Generate new random symbols + final symbol
    this.populateVisibleSymbols();
    
    // Calculate duration based on reel index (staggered effect)
    const duration = this.MIN_SPIN_DURATION + 
      (this.index * 300) + // Stagger start
      (Math.random() * (this.MAX_SPIN_DURATION - this.MIN_SPIN_DURATION)); // Randomness
    
    // Calculate distance - final symbol should end at center
    const distance = (this.visibleSymbols.length - 2) * this.SYMBOL_HEIGHT;
    
    // Start animation
    this.animationParams = { duration, distance };
    this.animationState = 'spin';
    
    // Apply CSS animation
    this.reelStrip.nativeElement.style.transition = `transform ${duration}ms cubic-bezier(0.1, 0.7, 0.1, 1)`;
    this.reelStrip.nativeElement.style.transform = `translateY(-${distance}px)`;
  }

  private stopAtSymbol(symbol: string): void {
    // Make sure the symbol appears at the center position
    const symbolIndex = this.visibleSymbols.findIndex(s => s === symbol);
    if (symbolIndex !== -1) {
      // Adjust position if needed
      const centerPosition = symbolIndex * this.SYMBOL_HEIGHT;
      if (this.reelStrip) {
        this.reelStrip.nativeElement.style.transform = `translateY(-${centerPosition}px)`;
      }
    }
  }
}
