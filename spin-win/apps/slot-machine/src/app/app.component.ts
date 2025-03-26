import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SlotMachineComponent } from './components/slot-machine/slot-machine.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';

@Component({
  standalone: true,
  imports: [RouterModule, HttpClientModule, SlotMachineComponent, LeaderboardComponent],
  selector: 'spin-win-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
