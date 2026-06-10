import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import mockCatalog from '../../../mock-catalog.json';
import { environment } from '../../environments/environment';
import { COMMUNITY_USERS, CYBERDROPS_BOT } from '../core/community-users';
import { formatCurrency, normalizeCurrency } from '../core/currency.utils';
import { Comment, Coupon, Offer, PublicationDraft, Store, User } from '../models';

interface ApiOffer {
  id: number; title: string; description?: string; store: string; category?: string;
  oldPrice?: number; currentPrice?: number; discount?: number; image?: string; url?: string;
  coupon?: Coupon | null; createdAt?: string;
}
interface ApiResponse { offers: ApiOffer[]; source?: string; message?: string; }
interface CommentReport { commentId: number; userId: number; reason: string; createdAt: string; }
interface LocalInteractions {
  likes: Record<string, number>;
  dislikes: Record<string, number>;
  comments: Record<string, Comment[]>;
  saved: number[];
  reportedComments: Record<string, CommentReport[]>;
  likedOffers: number[];
  dislikedOffers: number[];
  likedComments: Record<string, number[]>;
}

const fallbackOffers = mockCatalog as ApiOffer[];
const communityComments: Comment[] = [
  {
    id: 101, user: COMMUNITY_USERS[3], text: 'Preço digno de upgrade no setup. O histórico está excelente e ficou abaixo da média dos últimos meses.', likes: 18, time: 'há 12 min',
    replies: [{ id: 1001, user: COMMUNITY_USERS[5], text: 'Também acompanhei o histórico. Nesse valor, vale bastante a pena.', likes: 7, time: 'há 8 min' }]
  },
  {
    id: 102, user: COMMUNITY_USERS[5], text: 'Drop confirmado. Já entrou no meu radar de promoções e a loja está com entrega rápida para minha região.', likes: 11, time: 'há 28 min',
    replies: [{ id: 1002, user: COMMUNITY_USERS[1], text: 'Aqui também apareceu entrega antecipada. Ótimo sinal.', likes: 4, time: 'há 20 min' }]
  },
  {
    id: 103, user: COMMUNITY_USERS[1], text: 'Alguém já testou esse modelo por algumas semanas? Quero saber principalmente sobre acabamento e durabilidade.', likes: 9, time: 'há 43 min',
    replies: [
      { id: 1003, user: COMMUNITY_USERS[3], text: 'Uso uma versão parecida no setup. A construção é sólida e não apresentou folgas.', likes: 6, time: 'há 31 min' },
      { id: 1004, user: COMMUNITY_USERS[6], text: 'Vale conferir as avaliações recentes da loja antes de fechar.', likes: 3, time: 'há 25 min' }
    ]
  },
  {
    id: 104, user: COMMUNITY_USERS[6], text: 'Comparei com outras ofertas de hoje e esta continua sendo uma das melhores considerando preço e especificações.', likes: 14, time: 'há 1 h',
    replies: [{ id: 1005, user: COMMUNITY_USERS[4], text: 'Concordo. Produtos equivalentes estão custando bem mais.', likes: 5, time: 'há 52 min' }]
  },
  { id: 105, user: COMMUNITY_USERS[4], text: 'Oferta salva. Vou acompanhar até o fim do dia para decidir se faço o upgrade.', likes: 8, time: 'há 2 h' },
  {
    id: 106, user: COMMUNITY_USERS[7], text: 'O preço está competitivo, mas vale confirmar se a garantia é nacional antes de fechar.', likes: 22, time: 'há 2 h',
    replies: [{ id: 1006, user: COMMUNITY_USERS[2], text: 'Boa observação. A página da loja informa garantia de doze meses.', likes: 9, time: 'há 1 h' }]
  },
  { id: 107, user: COMMUNITY_USERS[2], text: 'Usei o cupom no checkout e o desconto apareceu corretamente para mim.', likes: 16, time: 'há 3 h' },
  {
    id: 108, user: COMMUNITY_USERS[0], text: 'Para quem está montando o primeiro setup, parece uma opção bem equilibrada pelo valor.', likes: 13, time: 'há 3 h',
    replies: [{ id: 1007, user: COMMUNITY_USERS[6], text: 'Concordo, principalmente considerando os recursos incluídos.', likes: 6, time: 'há 2 h' }]
  },
  { id: 109, user: COMMUNITY_USERS[6], text: 'A entrega da loja foi rápida na minha última compra e o produto chegou bem protegido.', likes: 7, time: 'há 4 h' },
  { id: 110, user: COMMUNITY_USERS[1], text: 'Alguém encontrou uma condição melhor pagando no Pix?', likes: 5, time: 'há 5 h' },
  { id: 111, user: COMMUNITY_USERS[5], text: 'As especificações atendem bem ao uso diário e também deixam margem para jogos competitivos.', likes: 10, time: 'há 6 h' },
  { id: 112, user: COMMUNITY_USERS[3], text: 'Já estava acompanhando este item e esta foi a primeira queda relevante de preço na semana.', likes: 19, time: 'há 7 h' }
];
const publicationMessages: Record<string, string> = {
  'Em análise': 'Sua publicação está sendo revisada pelos moderadores.',
  Publicado: 'Sua publicação já está visível para a comunidade.',
  Rejeitado: 'Esta publicação foi recusada por informações incompletas.'
};

@Injectable({ providedIn: 'root' })
export class OfferService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/offers`;
  private readonly storageKey = 'cyberdrops.interactions';
  private readonly publicationsKey = 'cyberdrops.publications';
  private interactions = this.readInteractions();
  private publications = this.readPublications();

  readonly stores: Store[] = [
    { id: 'Steam', name: 'Steam', icon: 'gamepad', color: '#66c0f4' }, { id: 'AliExpress', name: 'AliExpress', icon: 'shopping-bag', color: '#ff4747' },
    { id: 'Epic', name: 'Epic', icon: 'store', color: '#ffffff' }, { id: 'Kabum', name: 'Kabum', icon: 'cpu', color: '#ff6500' }, { id: 'Amazon', name: 'Amazon', icon: 'shopping-bag', color: '#ff9900' }
  ];
  readonly offers = signal<Offer[]>(this.mergePublications(this.normalizeMany(fallbackOffers)));
  readonly savedOffers = computed(() => this.offers().filter(offer => offer.saved));
  readonly loading = signal(false);
  readonly message = signal('');

  async getOffers(): Promise<Offer[]> { return this.fetch(this.api); }
  async getOfferById(id: number): Promise<Offer | undefined> {
    try {
      const response = await firstValueFrom(this.http.get<{ offer: ApiOffer }>(`${this.api}/${id}`));
      const offer = this.normalize(response.offer); this.upsert(offer); return offer;
    } catch { return this.offers().find(offer => offer.id === id); }
  }
  async searchOffers(query: string): Promise<Offer[]> { return this.fetch(`${this.api}/search`, new HttpParams().set('q', query)); }
  async filterByStore(store: string): Promise<Offer[]> { return store ? this.fetch(`${this.api}/store/${encodeURIComponent(store)}`) : this.getOffers(); }
  async filterByCategory(category: string): Promise<Offer[]> { return category && category !== 'Todos' ? this.fetch(`${this.api}/category/${encodeURIComponent(category)}`) : this.getOffers(); }
  async refreshOffers(): Promise<Offer[]> {
    this.loading.set(true);
    try {
      const response = await firstValueFrom(this.http.post<ApiResponse>(`${this.api}/refresh`, {}));
      return this.applyResponse(response);
    } catch { return this.useFallback(); } finally { this.loading.set(false); }
  }
  vote(id: number, kind: 'like' | 'dislike'): void {
    const bucket = kind === 'like' ? this.interactions.likes : this.interactions.dislikes;
    const selected = kind === 'like' ? this.interactions.likedOffers : this.interactions.dislikedOffers;
    const active = selected.includes(id);
    if (kind === 'like') this.interactions.likedOffers = active ? selected.filter(item => item !== id) : [...selected, id];
    else this.interactions.dislikedOffers = active ? selected.filter(item => item !== id) : [...selected, id];
    bucket[id] = Math.max(0, (bucket[id] || 0) + (active ? -1 : 1)); this.persist();
    this.offers.update(items => items.map(item => item.id === id ? { ...item, [kind === 'like' ? 'likes' : 'dislikes']: Math.max(0, item[kind === 'like' ? 'likes' : 'dislikes'] + (active ? -1 : 1)) } : item));
  }
  isVoted(id: number, kind: 'like' | 'dislike'): boolean {
    return (kind === 'like' ? this.interactions.likedOffers : this.interactions.dislikedOffers).includes(id);
  }
  addComment(id: number, text: string, user: User): void {
    const comment: Comment = { id: Date.now(), user, text, likes: 0, time: 'agora' };
    this.interactions.comments[id] = [...(this.interactions.comments[id] || []), comment]; this.persist();
    this.offers.update(items => items.map(item => item.id === id ? { ...item, comments: [...item.comments, comment] } : item));
  }
  likeComment(id: number, commentId: number): void {
    const comments = this.offers().find(item => item.id === id)?.comments || [];
    const liked = this.interactions.likedComments[id] || [];
    const active = liked.includes(commentId);
    this.interactions.likedComments[id] = active ? liked.filter(item => item !== commentId) : [...liked, commentId];
    this.interactions.comments[id] = comments.map(comment => comment.id === commentId ? { ...comment, likes: Math.max(0, comment.likes + (active ? -1 : 1)) } : comment);
    this.persist(); this.patchComments(id);
  }
  isCommentLiked(id: number, commentId: number): boolean {
    return (this.interactions.likedComments[id] || []).includes(commentId);
  }
  reply(id: number, commentId: number, text: string, user: User): void {
    const comments = this.offers().find(item => item.id === id)?.comments || [];
    this.interactions.comments[id] = comments.map(comment => comment.id === commentId ? { ...comment, replies: [...(comment.replies || []), { id: Date.now(), user, text, likes: 0, time: 'agora' }] } : comment);
    this.persist(); this.patchComments(id);
  }
  deleteComment(id: number, commentId: number, userId: number): boolean {
    const offer = this.offers().find(item => item.id === id);
    const comment = offer?.comments.find(item => item.id === commentId);
    if (!comment || comment.user.id !== userId) return false;
    this.interactions.comments[id] = (this.interactions.comments[id] || []).filter(item => item.id !== commentId);
    this.interactions.reportedComments[id] = (this.interactions.reportedComments[id] || []).filter(report => report.commentId !== commentId);
    this.persist();
    this.offers.update(items => items.map(item => item.id === id ? { ...item, comments: item.comments.filter(current => current.id !== commentId) } : item));
    return true;
  }
  reportComment(id: number, commentId: number, userId: number, reason: string): boolean {
    const comment = this.offers().find(item => item.id === id)?.comments.find(item => item.id === commentId);
    if (!comment || comment.user.id === userId) return false;
    const reported = this.interactions.reportedComments[id] || [];
    if (!reported.some(report => report.commentId === commentId && report.userId === userId)) {
      this.interactions.reportedComments[id] = [...reported, { commentId, userId, reason, createdAt: new Date().toISOString() }];
      this.persist();
    }
    return true;
  }
  isCommentReported(id: number, commentId: number, userId: number): boolean {
    return (this.interactions.reportedComments[id] || []).some(report => report.commentId === commentId && report.userId === userId);
  }
  toggleSaved(id: number): void {
    this.interactions.saved = this.interactions.saved.includes(id) ? this.interactions.saved.filter(item => item !== id) : [...this.interactions.saved, id];
    this.persist(); this.offers.update(items => items.map(item => item.id === id ? { ...item, saved: this.interactions.saved.includes(id) } : item));
  }
  createPublication(draft: PublicationDraft, author: User): Offer {
    const offer = this.buildPublication(draft, author, Date.now(), new Date().toISOString(), 'Em análise');
    this.publications = [offer, ...this.publications];
    this.persistPublications();
    this.offers.update(items => [offer, ...items.filter(item => item.id !== offer.id)]);
    return offer;
  }
  updatePublication(id: number, draft: PublicationDraft, author: User): Offer | undefined {
    const current = this.publications.find(item => item.id === id);
    if (!current || current.author.id !== author.id) return undefined;
    const updated = this.buildPublication(draft, author, id, current.createdAt, 'Em análise');
    this.publications = this.publications.map(item => item.id === id ? updated : item);
    this.persistPublications();
    this.offers.update(items => items.map(item => item.id === id ? updated : item));
    return updated;
  }
  deletePublication(id: number, authorId: number): boolean {
    const exists = this.publications.some(item => item.id === id && item.author.id === authorId);
    if (!exists) return false;
    this.publications = this.publications.filter(item => item.id !== id);
    this.persistPublications();
    this.offers.update(items => items.filter(item => item.id !== id));
    return true;
  }
  getUserPublications(authorId: number): Offer[] {
    return this.offers().filter(item => item.publicationType && item.author.id === authorId);
  }
  private buildPublication(draft: PublicationDraft, author: User, id: number, createdAt: string, status: Offer['publicationStatus']): Offer {
    const isCoupon = draft.type === 'coupon';
    const oldPrice = isCoupon ? 0 : normalizeCurrency(draft.oldPrice);
    const price = isCoupon ? 0 : normalizeCurrency(draft.price);
    const discount = isCoupon
      ? (draft.discountKind === 'percent' ? Math.round(draft.discountValue) : 0)
      : (oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0);
    return {
      id, author, store: draft.store, time: 'agora', image: isCoupon ? 'assets/coupon-background.png' : draft.image,
      gallery: [isCoupon ? 'assets/coupon-background.png' : draft.image], discount, category: isCoupon ? 'Cupons' : draft.category,
      title: isCoupon ? `Cupom ${draft.store}` : draft.title, description: draft.description, oldPrice, price,
      likes: 0, dislikes: 0, comments: [], url: draft.url, createdAt, publicationType: draft.type, publicationStatus: status,
      publicationDraft: { ...draft }, moderationMessage: publicationMessages[status || 'Em análise'],
      publisherType: 'user',
      publicationDiscountLabel: isCoupon && draft.discountKind === 'value' ? `${formatCurrency(draft.discountValue)} OFF` : undefined,
      coupon: isCoupon ? { code: draft.code, description: `${draft.description} · Válido até ${this.formatDate(draft.expiresAt)}`, store: draft.store } : undefined
    };
  }
  openStore(offer: Offer): void { window.open(offer.url, '_blank', 'noopener,noreferrer'); }
  getById(id: number): Offer | undefined { return this.offers().find(offer => offer.id === id); }

  private async fetch(url: string, params?: HttpParams): Promise<Offer[]> {
    this.loading.set(true); this.message.set('');
    try { return this.applyResponse(await firstValueFrom(this.http.get<ApiResponse>(url, { params }))); }
    catch { return this.useFallback(); } finally { this.loading.set(false); }
  }
  private applyResponse(response: ApiResponse): Offer[] {
    const offers = this.mergePublications(this.normalizeMany(response.offers)); this.offers.set(offers);
    if (response.source === 'mock') this.message.set('Não foi possível atualizar as ofertas agora. Exibindo dados salvos.');
    return offers;
  }
  private useFallback(): Offer[] {
    const offers = this.mergePublications(this.normalizeMany(fallbackOffers)); this.offers.set(offers); this.message.set('Não foi possível atualizar as ofertas agora. Exibindo dados salvos.'); return offers;
  }
  private normalizeMany(offers: ApiOffer[]): Offer[] { return offers.map(offer => this.normalize(offer)); }
  private normalize(offer: ApiOffer): Offer {
    const author = CYBERDROPS_BOT; const image = offer.coupon ? 'assets/coupon-background.png' : (offer.image || fallbackOffers[0].image!);
    const price = normalizeCurrency(offer.currentPrice);
    const oldPrice = normalizeCurrency(offer.oldPrice ?? price);
    const createdAt = offer.createdAt || new Date().toISOString();
    return { id: offer.id, author, publisherType: 'bot', store: offer.store, time: this.relativeTime(createdAt), image, gallery: [image], discount: Math.round(Math.abs(offer.discount || 0)), category: offer.category || 'Games', title: offer.title, description: offer.description || `Oferta encontrada na ${offer.store}.`, oldPrice, price, likes: 120 + (this.interactions.likes[offer.id] || 0), dislikes: 4 + (this.interactions.dislikes[offer.id] || 0), comments: this.commentsFor(offer.id), coupon: offer.coupon || undefined, url: offer.url || '#', createdAt, saved: this.interactions.saved.includes(offer.id) };
  }
  private upsert(offer: Offer): void { this.offers.update(items => items.some(item => item.id === offer.id) ? items.map(item => item.id === offer.id ? offer : item) : [...items, offer]); }
  private patchComments(id: number): void { this.offers.update(items => items.map(item => item.id === id ? { ...item, comments: this.interactions.comments[id] } : item)); }
  private commentsFor(id: number): Comment[] {
    const saved = this.interactions.comments[id] || [];
    const savedIds = new Set(saved.map(comment => comment.id));
    return [...saved, ...communityComments.filter(comment => !savedIds.has(comment.id))];
  }
  private readInteractions(): LocalInteractions {
    try {
      const saved = JSON.parse(localStorage.getItem(this.storageKey) || '') as Partial<LocalInteractions>;
      const reportedComments = Object.fromEntries(Object.entries(saved.reportedComments || {}).map(([offerId, reports]) => [
        offerId,
        (reports || []).map(report => typeof report === 'number'
          ? { commentId: report, userId: 1, reason: 'Motivo não informado', createdAt: new Date().toISOString() }
          : report)
      ]));
      return {
        likes: saved.likes || {}, dislikes: saved.dislikes || {}, comments: saved.comments || {}, saved: saved.saved || [], reportedComments,
        likedOffers: saved.likedOffers || [], dislikedOffers: saved.dislikedOffers || [], likedComments: saved.likedComments || {}
      };
    } catch { return { likes: {}, dislikes: {}, comments: {}, saved: [], reportedComments: {}, likedOffers: [], dislikedOffers: [], likedComments: {} }; }
  }
  private readPublications(): Offer[] {
    try {
      const saved = JSON.parse(localStorage.getItem(this.publicationsKey) || '') as Offer[];
      return saved.map(item => ({ ...item, publisherType: 'user', publicationDraft: item.publicationDraft || this.draftFromOffer(item), moderationMessage: item.moderationMessage || publicationMessages[item.publicationStatus || 'Em análise'] }));
    } catch {
      const author = { id: 1, name: 'NeonHunter', username: '@neonhunter', email: 'player@cyberdrops.gg', phone: '(11) 99999-2049', avatar: COMMUNITY_USERS[0].avatar };
      const mocks = [
        this.buildPublication({ type: 'deal', title: 'Mouse Gamer Logitech G502', store: 'Kabum', url: 'https://www.kabum.com.br/', price: 249.90, oldPrice: 429.90, category: 'Periféricos', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=85', description: 'Mouse gamer com sensor HERO e pesos ajustáveis.' }, author, 90001, '2026-06-09T15:00:00-03:00', 'Em análise'),
        this.buildPublication({ type: 'coupon', store: 'Kabum', code: 'CYBER10', discountKind: 'percent', discountValue: 10, expiresAt: '2026-12-31', description: 'Cupom válido em periféricos selecionados.', url: 'https://www.kabum.com.br/' }, author, 90002, '2026-06-08T14:00:00-03:00', 'Publicado'),
        this.buildPublication({ type: 'deal', title: 'Headset Gamer RGB', store: 'Amazon', url: 'https://www.amazon.com.br/', price: 159.90, oldPrice: 229.90, category: 'Periféricos', image: 'https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=900&q=85', description: 'Headset gamer RGB com som surround.' }, author, 90003, '2026-06-07T13:00:00-03:00', 'Rejeitado')
      ];
      localStorage.setItem(this.publicationsKey, JSON.stringify(mocks));
      return mocks;
    }
  }
  private draftFromOffer(item: Offer): PublicationDraft {
    if (item.publicationType === 'coupon') return { type: 'coupon', store: item.store, code: item.coupon?.code || '', discountKind: item.publicationDiscountLabel ? 'value' : 'percent', discountValue: item.discount, expiresAt: '', description: item.description, url: item.url };
    return { type: 'deal', title: item.title, store: item.store, url: item.url, price: item.price, oldPrice: item.oldPrice, category: item.category, image: item.image, description: item.description };
  }
  private persistPublications(): void { localStorage.setItem(this.publicationsKey, JSON.stringify(this.publications)); }
  private mergePublications(offers: Offer[]): Offer[] {
    const publicationIds = new Set(this.publications.map(item => item.id));
    return [...this.publications, ...offers.filter(item => !publicationIds.has(item.id))];
  }
  private formatDate(value: string): string {
    if (!value) return 'data não informada';
    return new Intl.DateTimeFormat('pt-BR').format(new Date(`${value}T12:00:00`));
  }
  private relativeTime(value: string): string {
    const elapsed = Math.max(0, Date.now() - new Date(value).getTime());
    const minutes = Math.floor(elapsed / 60_000);
    if (minutes < 1) return 'agora';
    if (minutes < 60) return `há ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `há ${days} ${days === 1 ? 'dia' : 'dias'}`;
    const months = Math.floor(days / 30);
    return `há ${months} ${months === 1 ? 'mês' : 'meses'}`;
  }
  private persist(): void { localStorage.setItem(this.storageKey, JSON.stringify(this.interactions)); }
}
