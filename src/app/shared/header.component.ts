import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { AppAvatarComponent } from './app-avatar.component';
import { AppIconComponent } from './app-icon.component';

@Component({
  selector: 'app-header', standalone: true, imports: [RouterLink, AppIconComponent, AppAvatarComponent],
  template: `<header class="app-header">
    <a class="brand" routerLink="/home" aria-label="CyberDrops"><img src="assets/logo.svg" alt="CyberDrops"></a>
    <div class="header-actions">
      <a class="icon-button" routerLink="/search" aria-label="Buscar"><app-icon name="search" [size]="24"/></a>
      <button class="icon-button" (click)="theme.toggle()" aria-label="Alternar tema"><app-icon [name]="theme.isLight() ? 'moon' : 'sun'" [size]="24"/></button>
      <a class="avatar mini" routerLink="/profile" aria-label="Perfil"><app-avatar [src]="user.user().avatar" [alt]="'Avatar de ' + user.user().name"/></a>
    </div>
  </header>`
})
export class HeaderComponent {
  readonly theme = inject(ThemeService);
  readonly user = inject(UserService);
}
