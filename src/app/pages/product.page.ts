import { Component, effect, inject, input, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { COPY_FEEDBACK_DURATION_MS } from "../core/app.constants";
import { copyText } from "../core/clipboard.utils";
import { formatCurrency } from "../core/currency.utils";
import { Offer } from "../models";
import { OfferService } from "../services/offer.service";
import { ShareService } from "../services/share.service";
import { UserService } from "../services/user.service";
import { AppAvatarComponent } from "../shared/app-avatar.component";
import { AppIconComponent } from "../shared/app-icon.component";
import { BrlCurrencyPipe, DiscountLabelPipe } from "../shared/brl-format.pipe";
import { CommentCardComponent } from "../shared/comment-card.component";
import { ContentCategoryBadgeComponent } from "../shared/content-category-badge.component";
import { CouponOfferCardComponent } from "../shared/coupon-offer-card.component";
import { ReportCommentModalComponent } from "../shared/report-comment-modal.component";
import { RelatedProductCardComponent } from "../shared/related-product-card.component";

const ABOUT_CATEGORY_DETAILS: Record<string, string> = {
  hardware:
    "Foi pensado para quem busca melhorar o desempenho e a estabilidade " +
    "do setup, equilibrando recursos atuais, construção confiável e espaço " +
    "para uso prolongado.",
  perifericos:
    "Combina ergonomia, resposta rápida e acabamento voltado para longas " +
    "sessões, ajudando a deixar o setup mais confortável, preciso e funcional.",
  consoles:
    "Entrega uma experiência prática para jogar, compartilhar e acessar " +
    "entretenimento, com integração simples ao ecossistema e recursos " +
    "preparados para diferentes estilos de uso.",
  games:
    "Oferece uma experiência completa para explorar, competir e jogar com " +
    "amigos, com conteúdo pensado para manter o jogador envolvido por muitas horas.",
};

const DEFAULT_ABOUT_DESCRIPTION =
  "É uma opção versátil para complementar o setup gamer com recursos úteis, " +
  "boa experiência de uso e excelente relação entre preço e benefício.";

@Component({
  standalone: true,
  imports: [
    BrlCurrencyPipe,
    DiscountLabelPipe,
    FormsModule,
    RouterLink,
    CommentCardComponent,
    ContentCategoryBadgeComponent,
    CouponOfferCardComponent,
    ReportCommentModalComponent,
    RelatedProductCardComponent,
    AppIconComponent,
    AppAvatarComponent,
  ],
  templateUrl: "./product.page.html",
})
export class ProductPage {
  readonly id = input<string>();
  readonly service = inject(OfferService);
  readonly shareService = inject(ShareService);
  readonly user = inject(UserService);
  readonly tab = signal<"discussion" | "about">("discussion");
  readonly copied = signal(false);
  readonly shared = signal(false);
  readonly commentFeedback = signal("");
  readonly reporting = signal<
    { offerId: number; commentId: number } | undefined
  >(undefined);
  readonly commentsVisible = signal(10);
  commentText = "";
  private copyFeedbackTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      const id = Number(this.id());
      this.commentsVisible.set(10);
      if (id) void this.service.getOfferById(id);
    });
  }
  offer() {
    return this.service.getById(Number(this.id()) || 1);
  }
  comment(id: number): void {
    if (!this.commentText.trim()) return;
    this.service.addComment(id, this.commentText.trim(), this.user.user());
    this.commentText = "";
  }
  likeComment(id: number, commentId: number): void {
    this.service.likeComment(id, commentId);
  }
  reply(id: number, event: { commentId: number; text: string }): void {
    this.service.reply(id, event.commentId, event.text, this.user.user());
  }
  deleteComment(id: number, commentId: number): void {
    if (this.service.deleteComment(id, commentId, this.user.user().id))
      this.showCommentFeedback("Comentário apagado com sucesso.");
  }
  openReport(offerId: number, commentId: number): void {
    this.reporting.set({ offerId, commentId });
  }
  submitReport(id: number, commentId: number, reason: string): void {
    if (
      this.service.reportComment(id, commentId, this.user.user().id, reason)
    ) {
      this.reporting.set(undefined);
      this.showCommentFeedback(
        "Denúncia enviada. O comentário será analisado pela nossa equipe.",
      );
    }
  }
  visibleComments(item: Offer) {
    return this.sortedComments(item).slice(0, this.commentsVisible());
  }
  hasMoreComments(item: Offer): boolean {
    return this.commentsVisible() < item.comments.length;
  }
  remainingComments(item: Offer): number {
    return Math.min(
      10,
      Math.max(0, item.comments.length - this.commentsVisible()),
    );
  }
  showMoreComments(): void {
    this.commentsVisible.update((count) => count + 10);
  }
  relatedCoupons(item: Offer): Offer[] {
    return this.service
      .offers()
      .filter((offer) => offer.id !== item.id && !!offer.coupon)
      .slice(0, 6);
  }
  relatedProducts(item: Offer): Offer[] {
    return this.service
      .offers()
      .filter((offer) => offer.id !== item.id && !offer.coupon)
      .slice(0, 3);
  }
  aboutTitle(item: Offer): string {
    return `${item.title}: desempenho e experiência`;
  }
  aboutDescription(item: Offer): string {
    const category = item.category.toLocaleLowerCase("pt-BR");
    const categoryDescription =
      ABOUT_CATEGORY_DETAILS[category] || DEFAULT_ABOUT_DESCRIPTION;
    const offerDescription =
      `A oferta encontrada na ${item.store} reduz o valor de ` +
      `${formatCurrency(item.oldPrice)} para ${formatCurrency(item.price)}, ` +
      "tornando este um momento interessante para considerar a compra.";
    const purchaseAdvice =
      "Antes de finalizar, confira disponibilidade, garantia, prazo de " +
      "entrega e condições apresentadas diretamente pela loja.";

    return [
      item.description,
      categoryDescription,
      offerDescription,
      purchaseAdvice,
    ].join(" ");
  }
  aboutHighlights(item: Offer): string[] {
    return [
      `${item.discount}% de desconto em relação ao preço anterior`,
      `Oferta disponível na ${item.store}`,
      `Categoria: ${item.category}`,
      "Preço e disponibilidade podem mudar sem aviso prévio",
    ];
  }
  couponValidity(item: Offer): string {
    const expiresAt =
      item.publicationDraft?.type === "coupon"
        ? item.publicationDraft.expiresAt
        : "";
    return expiresAt
      ? new Intl.DateTimeFormat("pt-BR").format(
          new Date(`${expiresAt}T12:00:00`),
        )
      : "Consulte as condições";
  }
  couponIsActive(item: Offer): boolean {
    const expiresAt =
      item.publicationDraft?.type === "coupon"
        ? item.publicationDraft.expiresAt
        : "";
    return (
      !expiresAt || new Date(`${expiresAt}T23:59:59`).getTime() >= Date.now()
    );
  }
  async copyCoupon(item: Offer, event: Event): Promise<void> {
    const button = event.currentTarget as HTMLButtonElement;
    if (!(await copyText(item.coupon?.code || ""))) return;
    this.copied.set(true);
    clearTimeout(this.copyFeedbackTimer);
    this.copyFeedbackTimer = setTimeout(() => {
      this.copied.set(false);
      button.blur();
    }, COPY_FEEDBACK_DURATION_MS);
  }
  async share(item: Offer): Promise<void> {
    const url = `${window.location.origin}/product/${item.id}`;
    const result = await this.shareService.share({
      title: item.title,
      text: `${item.coupon?.code}: ${item.coupon?.description || item.description}`,
      url,
    });
    if (result === "copied" || result === "native") {
      this.shared.set(true);
      setTimeout(() => this.shared.set(false), 1600);
    }
  }
  private showCommentFeedback(message: string): void {
    this.commentFeedback.set(message);
    setTimeout(() => this.commentFeedback.set(""), 2400);
  }
  private sortedComments(item: Offer) {
    return [...item.comments].sort(
      (a, b) =>
        this.commentEngagement(b) - this.commentEngagement(a) ||
        b.likes - a.likes ||
        b.id - a.id,
    );
  }
  private commentEngagement(comment: Offer["comments"][number]): number {
    const replies = comment.replies || [];
    return (
      comment.likes +
      replies.length * 3 +
      replies.reduce((total, reply) => total + reply.likes, 0)
    );
  }
}
