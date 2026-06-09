import { CurrencyPipe } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OfferService } from '../services/offer.service';
import { UserService } from '../services/user.service';
import { AppAvatarComponent } from '../shared/app-avatar.component';
import { AppIconComponent } from '../shared/app-icon.component';
import { CommentCardComponent } from '../shared/comment-card.component';
import { CouponCardComponent } from '../shared/coupon-card.component';

@Component({
  standalone: true, imports: [CurrencyPipe, FormsModule, RouterLink, CouponCardComponent, CommentCardComponent, AppIconComponent, AppAvatarComponent],
  template: `@if (offer(); as item) { <main class="product page">
    <a class="floating-back" routerLink="/home" aria-label="Voltar"><app-icon name="arrow-left" [size]="20"/></a><div class="product-image"><img [src]="selectedImage() || item.image" [alt]="item.title"><span class="discount">-{{ item.discount }}%</span></div>
    <div class="gallery">@for (image of item.gallery; track image) { <button (click)="selectedImage.set(image)"><img [src]="image" alt=""></button> }</div>
    <section class="product-info"><h1>{{ item.title }}</h1><p>{{ item.description }}</p><div class="price"><small>{{ item.oldPrice | currency:'BRL' }}</small><strong>{{ item.price | currency:'BRL' }}</strong></div>
      <button class="button primary wide" (click)="service.openStore(item)">Ir para a loja <app-icon name="external-link" [size]="18"/></button>@if (item.coupon) { <app-coupon-card [coupon]="item.coupon"/> }
      <div class="author"><span class="avatar"><app-avatar [src]="item.author.avatar" [alt]="'Avatar de ' + item.author.name"/></span><div><small>PUBLICADO POR</small><b>{{ item.author.name }}</b></div><div class="offer-actions"><button (click)="service.vote(item.id, 'like')"><app-icon name="flame" [size]="16"/>{{ item.likes }}</button><button (click)="service.toggleSaved(item.id)"><app-icon [name]="item.saved ? 'bookmark-check' : 'bookmark'" [size]="16"/>{{ item.saved ? 'Salvo' : 'Salvar' }}</button></div></div>
    </section>
    <section class="product-detail"><div class="tabs pill-tabs"><button [class.active]="tab() === 'discussion'" (click)="tab.set('discussion')">Discussão</button><button [class.active]="tab() === 'about'" (click)="tab.set('about')">Sobre o jogo</button></div>
      @if (tab() === 'discussion') { <div class="discussion"><div class="comment-composer"><span class="avatar"><app-avatar [src]="user.user().avatar" [alt]="'Avatar de ' + user.user().name"/></span><textarea [(ngModel)]="commentText" placeholder="O que você achou deste drop?"></textarea><button class="button primary" (click)="comment(item.id)"><app-icon name="send" [size]="16"/>Comentar</button></div>@for (comment of item.comments; track comment.id) { <app-comment-card [comment]="comment" (liked)="likeComment(item.id, $event)" (replied)="reply(item.id, $event)"/> }</div>
      } @else { <div class="about"><h2>Um futuro que vale a pena explorar</h2><p>Explore uma metrópole obcecada por poder, glamour e modificações corporais. Construa sua lenda, escolha seu estilo e encare missões de alto risco.</p><h3>Produtos relacionados</h3><div class="related">@for (related of service.offers(); track related.id) { <article><img [src]="related.image" [alt]="related.title"><div><b>{{ related.title }}</b><strong>{{ related.price | currency:'BRL' }}</strong><a class="button secondary" [routerLink]="['/product', related.id]">Ver produto</a></div></article> }</div></div> }
    </section>
  </main> }`
})
export class ProductPage {
  readonly id = input<string>();
  readonly service = inject(OfferService);
  readonly user = inject(UserService);
  readonly tab = signal<'discussion' | 'about'>('discussion');
  readonly selectedImage = signal('');
  commentText = '';
  constructor() { effect(() => { const id = Number(this.id()); if (id) void this.service.getOfferById(id); }); }
  offer() { return this.service.getById(Number(this.id()) || 1); }
  comment(id: number): void { if (!this.commentText.trim()) return; this.service.addComment(id, this.commentText.trim(), this.user.user()); this.commentText = ''; }
  likeComment(id: number, commentId: number): void { this.service.likeComment(id, commentId); }
  reply(id: number, event: { commentId: number; text: string }): void { this.service.reply(id, event.commentId, event.text, this.user.user()); }
}
