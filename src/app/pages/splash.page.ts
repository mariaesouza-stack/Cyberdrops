import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true, imports: [RouterLink],
  template: `<main class="splash">
    <div class="splash-grid"></div><div class="orb orb-one"></div><div class="orb orb-two"></div>
    <section><div class="logo-mark">CD</div><p class="eyebrow">BEM-VINDO AO DROP</p><h1>Cyber<span>Drops</span></h1><p>As melhores promoções gamer, descobertas pela comunidade em tempo real.</p>
      <a class="button primary wide" routerLink="/login">Começar <b>→</b></a><small>Economize. Jogue. Compartilhe.</small>
    </section>
  </main>`
})
export class SplashPage {}
