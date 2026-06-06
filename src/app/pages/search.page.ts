import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OfferService } from '../services/offer.service';
import { OfferCardComponent } from '../shared/offer-card.component';

@Component({
  standalone: true, imports: [FormsModule, OfferCardComponent],
  template: `<section class="page search-page"><p class="eyebrow">SCAN GLOBAL</p><h1>O que você procura?</h1>
    <label class="search-box">⌕<input [(ngModel)]="query" placeholder="Busque cupons, lojas, games e hardware"><button (click)="query.set('')">×</button></label>
    @if (query()) { <div class="search-results"><h2>Resultados para “{{ query() }}”</h2>@for (offer of results(); track offer.id) { <app-offer-card [offer]="offer"/> } @empty { <div class="empty"><b>Nenhum drop encontrado.</b><span>Tente buscar por Steam, games ou hardware.</span></div> }</div>
    } @else { <div class="discover"><section><h2>Lojas populares</h2><div class="store-grid">@for (store of service.stores; track store.id) { <button><i [style.background]="store.color">{{ store.icon }}</i><b>{{ store.name }}</b><span>Ver ofertas →</span></button> }</div></section>
      <section><h2>Cupons populares</h2><div class="quick-chips"><button>NIGHTCITY67</button><button>FREEWEEK</button><button>PLAYER20</button></div></section>
      <section><h2>Jogos populares</h2><div class="quick-chips"><button>Cyberpunk 2077</button><button>Indies</button><button>Co-op</button></div></section></div> }
  </section>`
})
export class SearchPage {
  readonly service = inject(OfferService); readonly query = signal('');
  readonly results = computed(() => { const q = this.query().toLowerCase(); return this.service.offers().filter(o => `${o.title} ${o.store} ${o.category} ${o.description}`.toLowerCase().includes(q)); });
}
