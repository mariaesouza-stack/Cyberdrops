import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OfferService } from '../services/offer.service';
import { OfferCardComponent } from '../shared/offer-card.component';

@Component({
  standalone: true, imports: [FormsModule, OfferCardComponent, RouterLink],
  template: `<section class="page search-page"><p class="eyebrow">SCAN GLOBAL</p><h1>O que você procura?</h1>
    <label class="search-box">⌕<input [(ngModel)]="query" placeholder="Busque cupons, lojas, games e hardware"><button (click)="query.set('')">×</button></label>
    @if (query()) { <div class="search-results"><h2>Resultados para “{{ query() }}”</h2>@for (offer of results(); track offer.id) { <app-offer-card [offer]="offer"/> } @empty { <div class="empty"><b>Nenhum drop encontrado.</b><span>Tente buscar por Steam, games ou hardware.</span></div> }</div>
    } @else { <div class="discover"><section><div class="section-heading"><h2>Lojas populares</h2><button>Ver todas</button></div><div class="popular-stores">@for (store of service.stores; track store.id) { <button><i [style.background]="store.color">{{ store.icon }}</i><b>{{ store.name }}</b></button> }</div></section>
      <section><div class="section-heading"><h2>Cupons populares</h2><button>Ver todos</button></div><div class="coupon-scroll"><article><small>STEAM</small><b>NIGHTCITY67</b><span>67% OFF</span><button>Copiar</button></article><article><small>EPIC</small><b>FREEWEEK</b><span>Jogo grátis</span><button>Copiar</button></article><article><small>KABUM</small><b>PLAYER20</b><span>20% OFF</span><button>Copiar</button></article></div></section>
      <section><div class="section-heading"><h2>Jogos populares</h2><button>Ver todos</button></div><div class="game-carousel">@for (game of service.offers(); track game.id) { <a [routerLink]="['/product', game.id]"><img [src]="game.image" [alt]="game.title"><b>{{ game.title }}</b><span>{{ game.store }}</span></a> }</div></section></div> }
  </section>`
})
export class SearchPage {
  readonly service = inject(OfferService); readonly query = signal('');
  readonly results = computed(() => { const q = this.query().toLowerCase(); return this.service.offers().filter(o => `${o.title} ${o.store} ${o.category} ${o.description}`.toLowerCase().includes(q)); });
}
