import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Comment, Coupon, Offer, Store, User } from '../models';

interface ApiOffer {
  id: number; title: string; description?: string; store: string; category?: string;
  oldPrice?: number; currentPrice?: number; discount?: number; image?: string; url?: string;
  coupon?: Coupon | null; createdAt?: string;
}
interface ApiResponse { offers: ApiOffer[]; source?: string; message?: string; }
interface LocalInteractions { likes: Record<string, number>; dislikes: Record<string, number>; comments: Record<string, Comment[]>; saved: number[]; }

const users: User[] = [
  { id: 2, name: 'Luna Nova', username: '@lunanova', email: '', phone: '', avatar: '🌙' },
  { id: 3, name: 'Zero Cool', username: '@zerocool', email: '', phone: '', avatar: '🤖' },
  { id: 4, name: 'Pixel Witch', username: '@pixelwitch', email: '', phone: '', avatar: '🧙' }
];
const fallbackOffers: ApiOffer[] = [
  { id: 1, store: 'Steam', category: 'Games', title: 'Cyberpunk 2077: Ultimate Edition', description: 'Night City nunca esteve tão barata. Inclui Phantom Liberty.', oldPrice: 299.90, currentPrice: 98.97, discount: 67, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=85', url: 'https://store.steampowered.com/', coupon: { code: 'NIGHTCITY67', description: '67% OFF na edição completa', store: 'Steam' } },
  { id: 2, store: 'Kabum', category: 'Hardware', title: 'Monitor Gamer UltraWide 34” 165Hz', description: 'Painel IPS, 1ms e suporte a FreeSync Premium.', oldPrice: 3299.90, currentPrice: 2499.90, discount: 24, image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=85', url: 'https://www.kabum.com.br/' },
  { id: 3, store: 'Epic', category: 'Cupons', title: 'Jogo misterioso grátis nesta semana', description: 'Resgate agora e mantenha para sempre na sua biblioteca.', oldPrice: 89.90, currentPrice: 0, discount: 100, image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=85', url: 'https://store.epicgames.com/pt-BR/free-games', coupon: { code: 'FREEWEEK', description: 'Resgate gratuito', store: 'Epic' } }
];

@Injectable({ providedIn: 'root' })
export class OfferService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/offers`;
  private readonly storageKey = 'cyberdrops.interactions';
  private interactions = this.readInteractions();

  readonly stores: Store[] = [
    { id: 'Steam', name: 'Steam', icon: '◉', color: '#66c0f4' }, { id: 'AliExpress', name: 'AliExpress', icon: 'A', color: '#ff4747' },
    { id: 'Epic', name: 'Epic', icon: 'E', color: '#ffffff' }, { id: 'Kabum', name: 'Kabum', icon: 'K', color: '#ff6500' }, { id: 'Amazon', name: 'Amazon', icon: 'a', color: '#ff9900' }
  ];
  readonly offers = signal<Offer[]>(this.normalizeMany(fallbackOffers));
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
  openStore(offer: Offer): void { window.open(offer.url, '_blank', 'noopener,noreferrer'); }
  getById(id: number): Offer | undefined { return this.offers().find(offer => offer.id === id); }

  private async fetch(url: string, params?: HttpParams): Promise<Offer[]> {
    this.loading.set(true); this.message.set('');
    try { return this.applyResponse(await firstValueFrom(this.http.get<ApiResponse>(url, { params }))); }
    catch { return this.useFallback(); } finally { this.loading.set(false); }
  }
  private applyResponse(response: ApiResponse): Offer[] {
    const offers = this.normalizeMany(response.offers); this.offers.set(offers);
    if (response.source === 'mock') this.message.set('Não foi possível atualizar as ofertas agora. Exibindo dados salvos.');
    return offers;
  }
  private useFallback(): Offer[] {
    const offers = this.normalizeMany(fallbackOffers); this.offers.set(offers); this.message.set('Não foi possível atualizar as ofertas agora. Exibindo dados salvos.'); return offers;
  }
  private normalizeMany(offers: ApiOffer[]): Offer[] { return offers.map(offer => this.normalize(offer)); }
  private normalize(offer: ApiOffer): Offer {
    const author = users[Math.abs(offer.id) % users.length]; const image = offer.image || fallbackOffers[0].image!;
    return { id: offer.id, author, store: offer.store, time: 'recentemente', image, gallery: [image], discount: Math.abs(offer.discount || 0), category: offer.category || 'Games', title: offer.title, description: offer.description || `Oferta encontrada na ${offer.store}.`, oldPrice: offer.oldPrice || offer.currentPrice || 0, price: offer.currentPrice || 0, likes: 120 + (this.interactions.likes[offer.id] || 0), dislikes: 4 + (this.interactions.dislikes[offer.id] || 0), comments: this.interactions.comments[offer.id] || [], coupon: offer.coupon || undefined, url: offer.url || '#', createdAt: offer.createdAt || new Date().toISOString(), saved: this.interactions.saved.includes(offer.id) };
  }
  private upsert(offer: Offer): void { this.offers.update(items => items.some(item => item.id === offer.id) ? items.map(item => item.id === offer.id ? offer : item) : [...items, offer]); }
  private patchComments(id: number): void { this.offers.update(items => items.map(item => item.id === id ? { ...item, comments: this.interactions.comments[id] } : item)); }
  private readInteractions(): LocalInteractions {
    try { return JSON.parse(localStorage.getItem(this.storageKey) || '') as LocalInteractions; } catch { return { likes: {}, dislikes: {}, comments: {}, saved: [] }; }
  }
  private persist(): void { localStorage.setItem(this.storageKey, JSON.stringify(this.interactions)); }
}
