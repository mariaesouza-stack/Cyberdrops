import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-navigation', standalone: true, imports: [RouterLink, RouterLinkActive],
  template: `<nav class="bottom-nav">
    <a routerLink="/home" routerLinkActive="active"><b>⌂</b><span>Feed</span></a>
    <a routerLink="/search" routerLinkActive="active"><b>⌕</b><span>Buscar</span></a>
    <button class="drop-button" aria-label="Nova promoção">＋</button>
    <a routerLink="/product/1" routerLinkActive="active"><b>⌁</b><span>Cupons</span></a>
    <a routerLink="/profile" routerLinkActive="active"><b>◎</b><span>Perfil</span></a>
  </nav>`
})
export class BottomNavigationComponent {}
