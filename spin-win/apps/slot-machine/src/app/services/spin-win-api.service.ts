import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpinResult } from '../models/spin-result.model';
import { LeaderboardEntry } from '../models/leaderboard-entry.model';
import { Player } from '../models/player.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpinWinApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Player endpoints
  getPlayer(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/players/${id}`);
  }

  getAllPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/players`);
  }

  createPlayer(name: string): Observable<Player> {
    return this.http.post<Player>(`${this.apiUrl}/players`, { name });
  }

  depositMoney(id: number, amount: number): Observable<Player> {
    return this.http.post<Player>(`${this.apiUrl}/players/${id}/deposit`, { amount });
  }

  updatePlayerBalance(id: number, amount: number): Observable<Player> {
    return this.http.patch<Player>(`${this.apiUrl}/players/${id}/balance`, { amount });
  }

  // Spin endpoints
  executeSpin(playerId: number, betAmount: number): Observable<SpinResult> {
    return this.http.post<SpinResult>(`${this.apiUrl}/spins`, { playerId, betAmount });
  }

  getSpinById(id: number): Observable<SpinResult> {
    return this.http.get<SpinResult>(`${this.apiUrl}/spins/${id}`);
  }

  getPlayerSpins(playerId: number): Observable<SpinResult[]> {
    return this.http.get<SpinResult[]>(`${this.apiUrl}/spins/player/${playerId}`);
  }

  // Leaderboard endpoints
  getTopPlayers(limit: number = 10): Observable<LeaderboardEntry[]> {
    return this.http.get<LeaderboardEntry[]>(`${this.apiUrl}/leaderboard/top?limit=${limit}`);
  }

  getPlayerStats(playerId: number): Observable<LeaderboardEntry> {
    return this.http.get<LeaderboardEntry>(`${this.apiUrl}/leaderboard/player/${playerId}`);
  }

  getAllLeaderboardEntries(): Observable<LeaderboardEntry[]> {
    return this.http.get<LeaderboardEntry[]>(`${this.apiUrl}/leaderboard`);
  }
}
