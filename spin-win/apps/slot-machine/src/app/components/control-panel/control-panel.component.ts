import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'spin-win-control-panel',
  imports: [CommonModule],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlPanelComponent {
  @Input() disabled = false;
  @Output() spinClicked = new EventEmitter<number>();

  betAmount = 10;
  betOptions = [5, 10, 25, 50, 100];

  onSpin(): void {
    this.spinClicked.emit(this.betAmount);
  }

  setBetAmount(amount: number): void {
    this.betAmount = amount;
  }

  increaseBet(): void {
    const currentIndex = this.betOptions.indexOf(this.betAmount);
    if (currentIndex < this.betOptions.length - 1) {
      this.betAmount = this.betOptions[currentIndex + 1];
    }
  }

  decreaseBet(): void {
    const currentIndex = this.betOptions.indexOf(this.betAmount);
    if (currentIndex > 0) {
      this.betAmount = this.betOptions[currentIndex - 1];
    }
  }
}
