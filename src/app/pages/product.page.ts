import { Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OfferService } from '../services/offer.service';
import { ShareService } from '../services/share.service';
import { UserService } from '../services/user.service';
import { Offer } from '../models';
import { AppAvatarComponent } from '../shared/app-avatar.component';
import { AppIconComponent } from '../shared/app-icon.component';
import { BrlCurrencyPipe, DiscountLabelPipe } from '../shared/brl-format.pipe';
import { CommentCardComponent } from '../shared/comment-card.component';
import { ContentCategoryBadgeComponent } from '../shared/content-category-badge.component';
import { CouponOfferCardComponent } from '../shared/coupon-offer-card.component';

@Component({
  standalone: true, imports: [BrlCurrencyPipe, DiscountLabelPipe, FormsModule, RouterLink, CommentCardComponent, ContentCategoryBadgeComponent, CouponOfferCardComponent, AppIconComponent, AppAvatarComponent],
  template: `@if (offer(); as item) {
    @if (item.coupon) {
      <main class="coupon-detail page">
        <header class="coupon-detail-header">
          <a routerLink="/home" aria-label="Voltar"><app-icon name="arrow-left" [size]="20"/></a>
          <div><small>CUPOM</small><h1>Detalhes do cupom</h1></div>
          <button type="button" aria-label="Compartilhar cupom" (click)="share(item)"><app-icon [name]="shared() ? 'check' : 'share'" [size]="18"/></button>
        </header>

        <section class="coupon-detail-card">
          <div class="coupon-detail-image">
            <img src="assets/coupon-background.png" alt="Imagem do cupom CyberDrops">
            <strong>{{ item.publicationDiscountLabel || (item.discount | discountLabel) }}</strong>
          </div>
          <div class="coupon-detail-content">
            <h2>{{ item.title }}</h2>
            <div class="coupon-store-category"><b>{{ item.store }}</b><span></span><app-content-category-badge [category]="item.category" [coupon]="true"/></div>
            <div class="coupon-code-row">
              <div><small>CÓDIGO DO CUPOM</small><strong>{{ item.coupon.code }}</strong></div>
              <button type="button" (click)="copyCoupon(item)"><app-icon [name]="copied() ? 'check' : 'copy'" [size]="18"/>{{ copied() ? 'Copiado' : 'Copiar' }}</button>
            </div>
            <button class="button primary wide" type="button" (click)="service.openStore(item)">Ir para loja <app-icon name="external-link" [size]="18"/></button>
            <div class="coupon-meta">
              <div><app-icon name="clock" [size]="18"/><span><small>VALIDADE</small><b>{{ couponValidity(item) }}</b></span></div>
              <div [class.expired]="!couponIsActive(item)"><app-icon [name]="couponIsActive(item) ? 'check' : 'x'" [size]="18"/><span><small>STATUS</small><b>{{ couponIsActive(item) ? 'Ativo' : 'Expirado' }}</b></span></div>
            </div>
          </div>
        </section>

        <section class="coupon-publisher">
          <span class="avatar"><app-avatar [src]="item.author.avatar" [alt]="'Avatar de ' + item.author.name"/></span>
          <div><small>PUBLICADO POR</small><b>{{ item.author.name }}</b><span>{{ item.time }}</span></div>
        </section>

        <div class="coupon-detail-actions">
          <button type="button" (click)="service.vote(item.id, 'like')"><app-icon name="flame" [size]="18"/>Curtir <b>{{ item.likes }}</b></button>
          <button type="button" [class.active]="item.saved" (click)="service.toggleSaved(item.id)"><app-icon [name]="item.saved ? 'bookmark-check' : 'bookmark'" [size]="18"/>{{ item.saved ? 'Salvo' : 'Salvar' }}</button>
          <button type="button" (click)="share(item)"><app-icon [name]="shared() ? 'check' : 'share'" [size]="18"/>Compartilhar</button>
        </div>

        <section class="coupon-section coupon-rules">
          <div class="coupon-section-title"><app-icon name="ticket-percent" [size]="20"/><h2>Regras de uso</h2></div>
          <p>{{ item.coupon.description || item.description }}</p>
          <ul><li><app-icon name="check" [size]="16"/>Aplique o código antes de finalizar a compra.</li><li><app-icon name="check" [size]="16"/>Confira produtos elegíveis e condições diretamente na loja.</li><li><app-icon name="check" [size]="16"/>O cupom pode ser encerrado pela loja sem aviso prévio.</li></ul>
        </section>

        <section class="coupon-section coupon-worked">
          <div><h2>Este cupom funcionou?</h2><p>Ajude a comunidade a identificar cupons ativos.</p></div>
          <div class="coupon-worked-actions">
            <button type="button" (click)="service.vote(item.id, 'like')"><app-icon name="check" [size]="18"/>Funcionou <b>{{ item.likes }}</b></button>
            <button type="button" (click)="service.vote(item.id, 'dislike')"><app-icon name="x" [size]="18"/>Não funcionou <b>{{ item.dislikes }}</b></button>
          </div>
        </section>

        <section class="coupon-section coupon-discussion">
          <div class="coupon-section-title"><app-icon name="message-circle" [size]="20"/><h2>Discussão</h2></div>
          <div class="comment-composer"><span class="avatar"><app-avatar [src]="user.user().avatar" [alt]="'Avatar de ' + user.user().name"/></span><textarea [(ngModel)]="commentText" placeholder="Compartilhe sua experiência com este cupom"></textarea><button class="button primary" (click)="comment(item.id)"><app-icon name="send" [size]="16"/>Comentar</button></div>
          <div class="coupon-comments">@for (comment of item.comments; track comment.id) { <app-comment-card [comment]="comment" (liked)="likeComment(item.id, $event)" (replied)="reply(item.id, $event)"/> }</div>
        </section>

        <section class="coupon-section coupon-related-section">
          <div class="coupon-section-title"><app-icon name="ticket-percent" [size]="20"/><h2>Cupons relacionados</h2></div>
          <div class="coupon-related">@for (related of relatedCoupons(item); track related.id) { <app-coupon-offer-card [offer]="related"/> } @empty { <p>Nenhum cupom relacionado disponível agora.</p> }</div>
        </section>
      </main>
    } @else {
    <main class="product page">
    <a class="floating-back" routerLink="/home" aria-label="Voltar"><app-icon name="arrow-left" [size]="20"/></a><div class="product-image"><img [src]="item.image" [alt]="item.title"><span class="discount">{{ item.discount | discountLabel }}</span></div>
    <section class="product-info"><h1>{{ item.title }}</h1><p>{{ item.description }}</p><div class="price"><small>{{ item.oldPrice | brlCurrency }}</small><strong>{{ item.price | brlCurrency }}</strong></div>
      <button class="button primary wide" (click)="service.openStore(item)">Ir para a loja <app-icon name="external-link" [size]="18"/></button>
      <div class="author"><span class="avatar"><app-avatar [src]="item.author.avatar" [alt]="'Avatar de ' + item.author.name"/></span><div><small>PUBLICADO POR</small><b>{{ item.author.name }}</b></div><div class="offer-actions"><button (click)="service.vote(item.id, 'like')"><app-icon name="flame" [size]="16"/>{{ item.likes }}</button><button (click)="service.toggleSaved(item.id)"><app-icon [name]="item.saved ? 'bookmark-check' : 'bookmark'" [size]="16"/>{{ item.saved ? 'Salvo' : 'Salvar' }}</button></div></div>
    </section>
    <section class="product-detail"><div class="tabs pill-tabs"><button [class.active]="tab() === 'discussion'" (click)="tab.set('discussion')">Discussão</button><button [class.active]="tab() === 'about'" (click)="tab.set('about')">Sobre o produto</button></div>
      @if (tab() === 'discussion') { <div class="discussion"><div class="comment-composer"><span class="avatar"><app-avatar [src]="user.user().avatar" [alt]="'Avatar de ' + user.user().name"/></span><textarea [(ngModel)]="commentText" placeholder="O que você achou deste drop?"></textarea><button class="button primary" (click)="comment(item.id)"><app-icon name="send" [size]="16"/>Comentar</button></div>@for (comment of item.comments; track comment.id) { <app-comment-card [comment]="comment" (liked)="likeComment(item.id, $event)" (replied)="reply(item.id, $event)"/> }</div>
      } @else { <div class="about"><h2>Um futuro que vale a pena explorar</h2><p>Explore uma metrópole obcecada por poder, glamour e modificações corporais. Construa sua lenda, escolha seu estilo e encare missões de alto risco.</p><h3>Produtos relacionados</h3><div class="related">@for (related of service.offers(); track related.id) { <article><img [src]="related.image" [alt]="related.title"><div><b>{{ related.title }}</b><strong>{{ related.price | brlCurrency }}</strong><a class="button secondary" [routerLink]="['/product', related.id]">Ver produto</a></div></article> }</div></div> }
    </section>
  </main>
    }
  }`
})
export class ProductPage {
  readonly id = input<string>();
  readonly service = inject(OfferService);
  readonly shareService = inject(ShareService);
  readonly user = inject(UserService);
  readonly tab = signal<'discussion' | 'about'>('discussion');
  readonly copied = signal(false);
  readonly shared = signal(false);
  commentText = '';
  constructor() { effect(() => { const id = Number(this.id()); if (id) void this.service.getOfferById(id); }); }
  offer() { return this.service.getById(Number(this.id()) || 1); }
  comment(id: number): void { if (!this.commentText.trim()) return; this.service.addComment(id, this.commentText.trim(), this.user.user()); this.commentText = ''; }
  likeComment(id: number, commentId: number): void { this.service.likeComment(id, commentId); }
  reply(id: number, event: { commentId: number; text: string }): void { this.service.reply(id, event.commentId, event.text, this.user.user()); }
  relatedCoupons(item: Offer): Offer[] { return this.service.offers().filter(offer => offer.id !== item.id && !!offer.coupon).slice(0, 6); }
  couponValidity(item: Offer): string {
    const expiresAt = item.publicationDraft?.type === 'coupon' ? item.publicationDraft.expiresAt : '';
    return expiresAt ? new Intl.DateTimeFormat('pt-BR').format(new Date(`${expiresAt}T12:00:00`)) : 'Consulte as condições';
  }
  couponIsActive(item: Offer): boolean {
    const expiresAt = item.publicationDraft?.type === 'coupon' ? item.publicationDraft.expiresAt : '';
    return !expiresAt || new Date(`${expiresAt}T23:59:59`).getTime() >= Date.now();
  }
  copyCoupon(item: Offer): void {
    void navigator.clipboard?.writeText(item.coupon?.code || '');
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1600);
  }
  async share(item: Offer): Promise<void> {
    const url = `${window.location.origin}/product/${item.id}`;
    const result = await this.shareService.share({ title: item.title, text: `${item.coupon?.code}: ${item.coupon?.description || item.description}`, url });
    if (result === 'copied' || result === 'native') {
      this.shared.set(true);
      setTimeout(() => this.shared.set(false), 1600);
    }
  }
}
