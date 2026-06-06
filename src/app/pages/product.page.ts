import { CurrencyPipe } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OfferService } from '../services/offer.service';
import { CommentCardComponent } from '../shared/comment-card.component';
import { CouponCardComponent } from '../shared/coupon-card.component';

@Component({
  standalone: true, imports: [CurrencyPipe, RouterLink, CouponCardComponent, CommentCardComponent],
  template: `@if (offer(); as item) { <main class="product page">
    <a class="floating-back" routerLink="/home">←</a><div class="product-image"><img [src]="selectedImage() || item.image" [alt]="item.title"><span class="discount">-{{ item.discount }}%</span></div>
    <div class="gallery">@for (image of item.gallery; track image) { <button (click)="selectedImage.set(image)"><img [src]="image" alt=""></button> }</div>
    <section class="product-info"><div class="badges"><span>{{ item.store }}</span><span>{{ item.category }}</span></div><h1>{{ item.title }}</h1><p>{{ item.description }}</p><div class="price"><small>{{ item.oldPrice | currency:'BRL' }}</small><strong>{{ item.price | currency:'BRL' }}</strong></div>
      <button class="button primary wide">Ir para a loja ↗</button>@if (item.coupon) { <app-coupon-card [coupon]="item.coupon"/> }
      <div class="author"><span class="avatar">{{ item.author.avatar }}</span><div><small>PUBLICADO POR</small><b>{{ item.author.name }}</b></div><div class="offer-actions"><button (click)="service.vote(item.id, 'like')">🔥 {{ item.likes }}</button><button>↗</button></div></div>
    </section>
    <section class="product-detail"><div class="tabs"><button [class.active]="tab() === 'discussion'" (click)="tab.set('discussion')">Discussão</button><button [class.active]="tab() === 'about'" (click)="tab.set('about')">Sobre o jogo</button></div>
      @if (tab() === 'discussion') { <div class="discussion"><textarea placeholder="O que você achou deste drop?"></textarea><button class="button secondary">Comentar</button>@for (comment of item.comments; track comment.id) { <app-comment-card [comment]="comment"/> }</div>
      } @else { <div class="about"><h2>Um futuro que vale a pena explorar</h2><p>Explore uma metrópole obcecada por poder, glamour e modificações corporais. Construa sua lenda, escolha seu estilo e encare missões de alto risco.</p><h3>Drops relacionados</h3><div class="related">@for (related of service.offers(); track related.id) { <a [routerLink]="['/product', related.id]"><img [src]="related.image"><b>{{ related.title }}</b></a> }</div></div> }
    </section>
  </main> }`
})
export class ProductPage {
  readonly id = input<string>();
  readonly service = inject(OfferService);
  readonly tab = signal<'discussion' | 'about'>('discussion');
  readonly selectedImage = signal('');
  offer() { return this.service.getById(Number(this.id()) || 1); }
}
