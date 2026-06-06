import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header', standalone: true, imports: [RouterLink],
  template: `<header class="app-header">
    <a class="brand" routerLink="/home"><span>CD</span>CyberDrops</a>
    <div class="header-actions">
      <a class="icon-button" routerLink="/search" aria-label="Buscar">⌕</a>
      <button class="icon-button" (click)="theme.toggle()" aria-label="Alternar tema">{{ theme.isLight() ? '☾' : '☼' }}</button>
      <a class="avatar mini" routerLink="/profile">{{ user.user().avatar }}</a>
    </div>
  </header>`
})
export class HeaderComponent {
  readonly theme = inject(ThemeService);
  readonly user = inject(UserService);
}
