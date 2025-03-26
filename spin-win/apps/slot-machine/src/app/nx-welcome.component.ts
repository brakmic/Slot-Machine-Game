import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'spin-win-nx-welcome',
    imports: [CommonModule],
    template: `
    <div>Welcome!</div>
  `,
    styles: [],
    encapsulation: ViewEncapsulation.None
})
export class NxWelcomeComponent {}
