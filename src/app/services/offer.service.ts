import { Injectable, signal } from '@angular/core';
import { Offer, Store, User } from '../models';

const users: User[] = [
  { id: 2, name: 'Luna Nova', username: '@lunanova', email: '', phone: '', avatar: '🌙' },
  { id: 3, name: 'Zero Cool', username: '@zerocool', email: '', phone: '', avatar: '🤖' },
  { id: 4, name: 'Pixel Witch', username: '@pixelwitch', email: '', phone: '', avatar: '🧙' }
];

@Injectable({ providedIn: 'root' })
export class OfferService {
  readonly stores: Store[] = [
    { id: 'Steam', name: 'Steam', icon: '◉', color: '#66c0f4' },
    { id: 'AliExpress', name: 'AliExpress', icon: 'A', color: '#ff4747' },
    { id: 'Epic', name: 'Epic', icon: 'E', color: '#ffffff' },
    { id: 'Kabum', name: 'Kabum', icon: 'K', color: '#ff6500' },
    { id: 'Amazon', name: 'Amazon', icon: 'a', color: '#ff9900' }
  ];
  readonly offers = signal<Offer[]>([
    {
      id: 1, author: users[0], store: 'Steam', time: 'há 12 min',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=85',
      gallery: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=85'],
      discount: 67, category: 'Games', title: 'Cyberpunk 2077: Ultimate Edition', description: 'Night City nunca esteve tão barata. Inclui Phantom Liberty.', oldPrice: 299.90, price: 98.97, likes: 842, dislikes: 21,
      coupon: { code: 'NIGHTCITY67', description: '67% OFF na edição completa', store: 'Steam' },
      comments: [{ id: 1, user: users[1], text: 'Agora sim chegou no meu preço-alvo. Vale demais!', likes: 42, time: 'há 5 min', replies: [{ id: 2, user: users[0], text: 'A expansão sozinha já vale o pacote.', likes: 15, time: 'há 2 min' }] }]
    },
    {
      id: 2, author: users[1], store: 'Kabum', time: 'há 34 min',
      image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=85',
      gallery: ['https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=85'],
      discount: 24, category: 'Hardware', title: 'Monitor Gamer UltraWide 34” 165Hz', description: 'Painel IPS, 1ms e suporte a FreeSync Premium.', oldPrice: 3299.90, price: 2499.90, likes: 516, dislikes: 38, comments: []
    },
    {
      id: 3, author: users[2], store: 'Epic', time: 'há 1 h',
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=85',
      gallery: ['https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=85'],
      discount: 100, category: 'Cupons', title: 'Jogo misterioso grátis nesta semana', description: 'Resgate agora e mantenha para sempre na sua biblioteca.', oldPrice: 89.90, price: 0, likes: 1204, dislikes: 7,
      coupon: { code: 'FREEWEEK', description: 'Resgate gratuito', store: 'Epic' }, comments: []
    }
  ]);
  vote(id: number, kind: 'like' | 'dislike'): void {
    this.offers.update(items => items.map(item => item.id === id ? { ...item, [kind === 'like' ? 'likes' : 'dislikes']: item[kind === 'like' ? 'likes' : 'dislikes'] + 1 } : item));
  }
  getById(id: number): Offer | undefined { return this.offers().find(offer => offer.id === id); }
}
