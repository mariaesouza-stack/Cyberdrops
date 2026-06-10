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
import { ReportCommentModalComponent } from '../shared/report-comment-modal.component';
import { RelatedProductCardComponent } from '../shared/related-product-card.component';

@Component({
  standalone: true, imports: [BrlCurrencyPipe, DiscountLabelPipe, FormsModule, RouterLink, CommentCardComponent, ContentCategoryBadgeComponent, CouponOfferCardComponent, ReportCommentModalComponent, RelatedProductCardComponent, AppIconComponent, AppAvatarComponent],
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
          <button type="button" [class.active]="service.isVoted(item.id, 'like')" (click)="service.vote(item.id, 'like')"><app-icon name="flame" [size]="18"/>Curtir <b>{{ item.likes }}</b></button>
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
            <button type="button" [class.active]="service.isVoted(item.id, 'like')" (click)="service.vote(item.id, 'like')"><app-icon name="check" [size]="18"/>Funcionou <b>{{ item.likes }}</b></button>
            <button type="button" [class.active]="service.isVoted(item.id, 'dislike')" (click)="service.vote(item.id, 'dislike')"><app-icon name="x" [size]="18"/>Não funcionou <b>{{ item.dislikes }}</b></button>
          </div>
        </section>

        <section class="coupon-section coupon-discussion">
          <div class="coupon-section-title"><app-icon name="message-circle" [size]="20"/><h2>Discussão</h2></div>
          <div class="comment-composer"><span class="avatar"><app-avatar [src]="user.user().avatar" [alt]="'Avatar de ' + user.user().name"/></span><textarea [(ngModel)]="commentText" placeholder="Compartilhe sua experiência com este cupom"></textarea><button class="button primary" (click)="comment(item.id)"><app-icon name="send" [size]="16"/>Comentar</button></div>
          @if (commentFeedback()) { <p class="comment-action-feedback" role="status">{{ commentFeedback() }}</p> }
          <div class="coupon-comments">@for (comment of visibleComments(item); track comment.id) { <app-comment-card [comment]="comment" [currentUserId]="user.user().id" [reported]="service.isCommentReported(item.id, comment.id, user.user().id)" [likedByUser]="service.isCommentLiked(item.id, comment.id)" (liked)="likeComment(item.id, $event)" (replied)="reply(item.id, $event)" (deleted)="deleteComment(item.id, $event)" (reportedComment)="openReport(item.id, $event)"/> }</div>
          @if (hasMoreComments(item)) { <button type="button" class="comments-load-more" (click)="showMoreComments()">Ver mais comentários <span>{{ remainingComments(item) }}</span><app-icon name="arrow-right" [size]="16"/></button> }
        </section>

        <section class="coupon-section coupon-related-section">
          <div class="coupon-section-title"><app-icon name="ticket-percent" [size]="20"/><h2>Cupons relacionados</h2></div>
          <div class="coupon-related">@for (related of relatedCoupons(item); track related.id) { <app-coupon-offer-card [offer]="related"/> } @empty { <p>Nenhum cupom relacionado disponível agora.</p> }</div>
        </section>
      </main>
    } @else {
    <main class="product page">
    <a class="floating-back" routerLink="/home" aria-label="Voltar"><app-icon name="arrow-left" [size]="20"/></a><div class="product-image"><img [src]="item.image" [alt]="item.title"><span class="discount">{{ item.discount | discountLabel }}</span></div>
    <section class="product-info"><div class="product-context"><app-content-category-badge [category]="item.category"/><span>{{ item.store }}</span></div><h1>{{ item.title }}</h1><p>{{ item.description }}</p><div class="price"><small>{{ item.oldPrice | brlCurrency }}</small><strong>{{ item.price | brlCurrency }}</strong></div>
      <button class="button primary wide" (click)="service.openStore(item)">Ir para a loja <app-icon name="external-link" [size]="18"/></button>
      <div class="author"><span class="avatar"><app-avatar [src]="item.author.avatar" [alt]="'Avatar de ' + item.author.name"/></span><div><small>PUBLICADO POR</small><b>{{ item.author.name }}</b></div><div class="offer-actions"><button [class.active]="service.isVoted(item.id, 'like')" (click)="service.vote(item.id, 'like')"><app-icon name="flame" [size]="16"/>{{ item.likes }}</button><button [class.active]="item.saved" (click)="service.toggleSaved(item.id)"><app-icon [name]="item.saved ? 'bookmark-check' : 'bookmark'" [size]="16"/>{{ item.saved ? 'Salvo' : 'Salvar' }}</button></div></div>
    </section>
    <section class="product-detail"><div class="tabs pill-tabs"><button [class.active]="tab() === 'discussion'" (click)="tab.set('discussion')">Discussão</button><button [class.active]="tab() === 'about'" (click)="tab.set('about')">Sobre o produto</button></div>
      @if (tab() === 'discussion') { <div class="discussion"><div class="comment-composer"><span class="avatar"><app-avatar [src]="user.user().avatar" [alt]="'Avatar de ' + user.user().name"/></span><textarea [(ngModel)]="commentText" placeholder="O que você achou deste drop?"></textarea><button class="button primary" (click)="comment(item.id)"><app-icon name="send" [size]="16"/>Comentar</button></div>@if (commentFeedback()) { <p class="comment-action-feedback" role="status">{{ commentFeedback() }}</p> }@for (comment of visibleComments(item); track comment.id) { <app-comment-card [comment]="comment" [currentUserId]="user.user().id" [reported]="service.isCommentReported(item.id, comment.id, user.user().id)" [likedByUser]="service.isCommentLiked(item.id, comment.id)" (liked)="likeComment(item.id, $event)" (replied)="reply(item.id, $event)" (deleted)="deleteComment(item.id, $event)" (reportedComment)="openReport(item.id, $event)"/> }@if (hasMoreComments(item)) { <button type="button" class="comments-load-more" (click)="showMoreComments()">Ver mais comentários <span>{{ remainingComments(item) }}</span><app-icon name="arrow-right" [size]="16"/></button> }</div>
      } @else { <div class="about"><p class="eyebrow">DETALHES DO DROP</p><h2>{{ aboutTitle(item) }}</h2><p>{{ aboutDescription(item) }}</p><div class="about-highlights">@for (highlight of aboutHighlights(item); track highlight) { <span><app-icon name="check" [size]="16"/>{{ highlight }}</span> }</div><h3>Produtos relacionados</h3><div class="related">@for (related of relatedProducts(item); track related.id) { <app-related-product-card [product]="related"/> } @empty { <p>Nenhum produto relacionado disponível agora.</p> }</div></div> }
    </section>
  </main>
    }
  }
  @if (reporting(); as report) { <app-report-comment-modal (cancelled)="reporting.set(undefined)" (submitted)="submitReport(report.offerId, report.commentId, $event)"/> }`
})
export class ProductPage {
  readonly id = input<string>();
  readonly service = inject(OfferService);
  readonly shareService = inject(ShareService);
  readonly user = inject(UserService);
  readonly tab = signal<'discussion' | 'about'>('discussion');
  readonly copied = signal(false);
  readonly shared = signal(false);
  readonly commentFeedback = signal('');
  readonly reporting = signal<{ offerId: number; commentId: number } | undefined>(undefined);
  readonly commentsVisible = signal(10);
  commentText = '';
  constructor() { effect(() => { const id = Number(this.id()); this.commentsVisible.set(10); if (id) void this.service.getOfferById(id); }); }
  offer() { return this.service.getById(Number(this.id()) || 1); }
  comment(id: number): void { if (!this.commentText.trim()) return; this.service.addComment(id, this.commentText.trim(), this.user.user()); this.commentText = ''; }
  likeComment(id: number, commentId: number): void { this.service.likeComment(id, commentId); }
  reply(id: number, event: { commentId: number; text: string }): void { this.service.reply(id, event.commentId, event.text, this.user.user()); }
  deleteComment(id: number, commentId: number): void {
    if (this.service.deleteComment(id, commentId, this.user.user().id)) this.showCommentFeedback('Comentário apagado com sucesso.');
  }
  openReport(offerId: number, commentId: number): void {
    this.reporting.set({ offerId, commentId });
  }
  submitReport(id: number, commentId: number, reason: string): void {
    if (this.service.reportComment(id, commentId, this.user.user().id, reason)) {
      this.reporting.set(undefined);
      this.showCommentFeedback('Denúncia enviada. O comentário será analisado pela nossa equipe.');
    }
  }
  visibleComments(item: Offer) { return this.sortedComments(item).slice(0, this.commentsVisible()); }
  hasMoreComments(item: Offer): boolean { return this.commentsVisible() < item.comments.length; }
  remainingComments(item: Offer): number { return Math.min(10, Math.max(0, item.comments.length - this.commentsVisible())); }
  showMoreComments(): void { this.commentsVisible.update(count => count + 10); }
  relatedCoupons(item: Offer): Offer[] { return this.service.offers().filter(offer => offer.id !== item.id && !!offer.coupon).slice(0, 6); }
  relatedProducts(item: Offer): Offer[] { return this.service.offers().filter(offer => offer.id !== item.id && !offer.coupon).slice(0, 3); }
  aboutTitle(item: Offer): string { return `${item.title}: desempenho e experiência`; }
  aboutDescription(item: Offer): string {
    const categoryDetails: Record<string, string> = {
      hardware: 'Foi pensado para quem busca melhorar o desempenho e a estabilidade do setup, equilibrando recursos atuais, construção confiável e espaço para uso prolongado.',
      perifericos: 'Combina ergonomia, resposta rápida e acabamento voltado para longas sessões, ajudando a deixar o setup mais confortável, preciso e funcional.',
      consoles: 'Entrega uma experiência prática para jogar, compartilhar e acessar entretenimento, com integração simples ao ecossistema e recursos preparados para diferentes estilos de uso.',
      games: 'Oferece uma experiência completa para explorar, competir e jogar com amigos, com conteúdo pensado para manter o jogador envolvido por muitas horas.'
    };
    const category = item.category.toLocaleLowerCase('pt-BR');
    return `${item.description} ${categoryDetails[category] || 'É uma opção versátil para complementar o setup gamer com recursos úteis, boa experiência de uso e excelente relação entre preço e benefício.'} A oferta encontrada na ${item.store} reduz o valor de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.oldPrice)} para ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}, tornando este um momento interessante para considerar a compra. Antes de finalizar, confira disponibilidade, garantia, prazo de entrega e condições apresentadas diretamente pela loja.`;
  }
  aboutHighlights(item: Offer): string[] {
    return [
      `${item.discount}% de desconto em relação ao preço anterior`,
      `Oferta disponível na ${item.store}`,
      `Categoria: ${item.category}`,
      'Preço e disponibilidade podem mudar sem aviso prévio'
    ];
  }
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
  private showCommentFeedback(message: string): void {
    this.commentFeedback.set(message);
    setTimeout(() => this.commentFeedback.set(''), 2400);
  }
  private sortedComments(item: Offer) {
    return [...item.comments].sort((a, b) => this.commentEngagement(b) - this.commentEngagement(a) || b.likes - a.likes || b.id - a.id);
  }
  private commentEngagement(comment: Offer['comments'][number]): number {
    const replies = comment.replies || [];
    return comment.likes + (replies.length * 3) + replies.reduce((total, reply) => total + reply.likes, 0);
  }
}
