import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private muted = new BehaviorSubject<boolean>(true); // Muted by default
  muted$ = this.muted.asObservable();
  
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private soundFiles = {
    spin: '/assets/sounds/spin.mp3',
    win: '/assets/sounds/win.mp3',
    jackpot: '/assets/sounds/jackpot.mp3',
    loss: '/assets/sounds/loss.mp3',
    buttonClick: '/assets/sounds/button-click.mp3'
  };
  
  constructor() {
    this.preloadSounds();
  }
  
  private preloadSounds(): void {
    for (const [name, path] of Object.entries(this.soundFiles)) {
      this.sounds[name] = new Audio();
      this.sounds[name].src = path;
      this.sounds[name].load();
    }
  }
  
  toggleMute(): void {
    this.muted.next(!this.muted.value);
  }
  
  playSound(soundName: string): void {
    if (this.muted.value || !this.sounds[soundName]) return;
    
    try {
      const sound = this.sounds[soundName];
      sound.currentTime = 0;
      sound.play().catch(error => {
        console.warn(`Failed to play sound ${soundName}:`, error);
      });
    } catch (error) {
      console.warn(`Error playing sound ${soundName}:`, error);
    }
  }
}
