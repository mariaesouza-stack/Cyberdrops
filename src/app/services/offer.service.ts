import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
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
interface LocalInteractions { likes: Record<string, number>; dislikes: Record<string, number>; comments: Record<string, Comment[]>; saved: number[]; }

const fallbackOffers: ApiOffer[] = [
  { id: 1, store: 'Steam', category: 'Games', title: 'Cyberpunk 2077: Ultimate Edition', description: 'Night City nunca esteve tão barata. Inclui Phantom Liberty.', oldPrice: 299.90, currentPrice: 98.97, discount: 67, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=85', url: 'https://store.steampowered.com/', coupon: { code: 'NIGHTCITY67', description: '67% OFF na edição completa', store: 'Steam' } },
  { id: 2, store: 'Kabum', category: 'Hardware', title: 'Monitor Gamer UltraWide 34” 165Hz', description: 'Painel IPS, 1ms e suporte a FreeSync Premium.', oldPrice: 3299.90, currentPrice: 2499.90, discount: 24, image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=85', url: 'https://www.kabum.com.br/' },
  { id: 3, store: 'Epic', category: 'Cupons', title: 'Jogo misterioso grátis nesta semana', description: 'Resgate agora e mantenha para sempre na sua biblioteca.', oldPrice: 89.90, currentPrice: 0, discount: 100, image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=85', url: 'https://store.epicgames.com/pt-BR/free-games', coupon: { code: 'FREEWEEK', description: 'Resgate gratuito', store: 'Epic' } },
  { id: 4, store: 'Amazon', category: 'Consoles', title: 'Controle sem fio para Xbox Series com conexão Bluetooth', description: 'Controle sem fio com textura aderente e botão de compartilhamento dedicado.', oldPrice: 499.90, currentPrice: 359.90, discount: 28, image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=1200&q=85', url: 'https://www.amazon.com.br/' }
];
const communityComments: Comment[] = [
  { id: 101, user: COMMUNITY_USERS[3], text: 'Preço digno de upgrade no setup. O histórico está excelente.', likes: 18, time: 'há 12 min' },
  { id: 102, user: COMMUNITY_USERS[5], text: 'Drop confirmado. Já entrou no meu radar de promoções.', likes: 11, time: 'há 28 min' }
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
    bucket[id] = (bucket[id] || 0) + 1; this.persist();
    this.offers.update(items => items.map(item => item.id === id ? { ...item, [kind === 'like' ? 'likes' : 'dislikes']: item[kind === 'like' ? 'likes' : 'dislikes'] + 1 } : item));
  }
  addComment(id: number, text: string, user: User): void {
    const comment: Comment = { id: Date.now(), user, text, likes: 0, time: 'agora' };
    this.interactions.comments[id] = [...(this.interactions.comments[id] || []), comment]; this.persist();
    this.offers.update(items => items.map(item => item.id === id ? { ...item, comments: [...item.comments, comment] } : item));
  }
  likeComment(id: number, commentId: number): void {
    const comments = this.interactions.comments[id] || this.offers().find(item => item.id === id)?.comments || [];
    this.interactions.comments[id] = comments.map(comment => comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment);
    this.persist(); this.patchComments(id);
  }
  reply(id: number, commentId: number, text: string, user: User): void {
    const comments = this.interactions.comments[id] || this.offers().find(item => item.id === id)?.comments || [];
    this.interactions.comments[id] = comments.map(comment => comment.id === commentId ? { ...comment, replies: [...(comment.replies || []), { id: Date.now(), user, text, likes: 0, time: 'agora' }] } : comment);
    this.persist(); this.patchComments(id);
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
    return { id: offer.id, author, publisherType: 'bot', store: offer.store, time: 'recentemente', image, gallery: [image], discount: Math.round(Math.abs(offer.discount || 0)), category: offer.category || 'Games', title: offer.title, description: offer.description || `Oferta encontrada na ${offer.store}.`, oldPrice, price, likes: 120 + (this.interactions.likes[offer.id] || 0), dislikes: 4 + (this.interactions.dislikes[offer.id] || 0), comments: this.interactions.comments[offer.id] || communityComments, coupon: offer.coupon || undefined, url: offer.url || '#', createdAt: offer.createdAt || new Date().toISOString(), saved: this.interactions.saved.includes(offer.id) };
  }
  private upsert(offer: Offer): void { this.offers.update(items => items.some(item => item.id === offer.id) ? items.map(item => item.id === offer.id ? offer : item) : [...items, offer]); }
  private patchComments(id: number): void { this.offers.update(items => items.map(item => item.id === id ? { ...item, comments: this.interactions.comments[id] } : item)); }
  private readInteractions(): LocalInteractions {
    try { return JSON.parse(localStorage.getItem(this.storageKey) || '') as LocalInteractions; } catch { return { likes: {}, dislikes: {}, comments: {}, saved: [] }; }
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
  private persist(): void { localStorage.setItem(this.storageKey, JSON.stringify(this.interactions)); }
}
