import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIconComponent } from '../shared/app-icon.component';

@Component({
  standalone: true, imports: [RouterLink, AppIconComponent],
  template: `<main class="splash">
    <div class="splash-grid"></div><div class="orb orb-one"></div><div class="orb orb-two"></div>
    <section><img class="splash-logo" src="assets/logo.svg" alt="CyberDrops"><p class="eyebrow">BEM-VINDO AO DROP</p><p>As melhores promoções gamer, descobertas pela comunidade em tempo real.</p>
      <a class="button primary wide" routerLink="/login">Começar <app-icon name="arrow-right" [size]="20"/></a><small>Economize. Jogue. Compartilhe.</small>
    </section>
  </main>`
})
export class SplashPage {}
