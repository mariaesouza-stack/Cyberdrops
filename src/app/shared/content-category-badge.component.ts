import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-content-category-badge',
  standalone: true,
  template: `<span class="content-category-tag" [attr.data-category]="key()">{{ label() }}</span>`
})
export class ContentCategoryBadgeComponent {
  readonly category = input('');
  readonly coupon = input(false);
  readonly label = computed(() => {
    const category = this.category().trim().toLocaleLowerCase('pt-BR');
    if (this.coupon() && (!category || category === 'cupom' || category === 'cupons' || category === 'geral')) return 'Geral';
    if (category === 'hardware' || category === 'hardwares') return 'Hardware';
    if (category === 'periférico' || category === 'periféricos' || category === 'periferico' || category === 'perifericos') return 'Periféricos';
    if (category === 'console' || category === 'consoles') return 'Consoles';
    if (category === 'game' || category === 'games') return 'Games';
    return this.category() || 'Geral';
  });
  readonly key = computed(() => this.label().toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
}
