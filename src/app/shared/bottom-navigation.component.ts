import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `<nav class="bottom-nav" aria-label="Navegação principal">
    <a routerLink="/home" routerLinkActive="active"><b>⌂</b><span>Home</span></a>
    <a routerLink="/search" routerLinkActive="active"><b>⌕</b><span>Buscar</span></a>
    <button class="publish-button" aria-label="Publicar oferta"><b>＋</b><span>Publicar</span></button>
    <a routerLink="/notifications" routerLinkActive="active"><b>♧</b><span>Notificações</span></a>
    <a routerLink="/profile" routerLinkActive="active"><b>◎</b><span>Perfil</span></a>
  </nav>`
})
export class BottomNavigationComponent {}
