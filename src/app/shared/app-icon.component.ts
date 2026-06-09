import { Component, computed, input } from '@angular/core';
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideBell,
  LucideBookmark,
  LucideBookmarkCheck,
  LucideBot,
  LucideBrainCircuit,
  LucideCheck,
  LucideCopy,
  LucideCpu,
  LucideDynamicIcon,
  LucideExternalLink,
  LucideFlame,
  LucideGamepad2,
  LucideGhost,
  LucideHeart,
  LucideLogOut,
  LucideMoon,
  LucidePencil,
  LucideRadar,
  LucideReply,
  LucideRocket,
  LucideSearch,
  LucideSend,
  LucideShare2,
  LucideShoppingBag,
  LucideSkull,
  LucideStore,
  LucideSun,
  LucideSwords,
  LucideUserRound,
  LucideVenetianMask,
  LucideWandSparkles,
  LucideX,
  LucideZap,
  type LucideIcon
} from '@lucide/angular';

export type AppIconName =
  | 'arrow-left' | 'arrow-right' | 'bell' | 'bookmark' | 'bookmark-check'
  | 'bot' | 'brain-circuit' | 'check' | 'copy' | 'cpu' | 'external-link'
  | 'flame' | 'gamepad' | 'ghost' | 'heart' | 'log-out' | 'moon' | 'pencil'
  | 'radar' | 'reply' | 'rocket' | 'search' | 'send' | 'share' | 'shopping-bag'
  | 'skull' | 'store' | 'sun' | 'swords' | 'user' | 'venetian-mask'
  | 'wand-sparkles' | 'x' | 'zap';

const ICONS: Record<AppIconName, LucideIcon> = {
  'arrow-left': LucideArrowLeft,
  'arrow-right': LucideArrowRight,
  bell: LucideBell,
  bookmark: LucideBookmark,
  'bookmark-check': LucideBookmarkCheck,
  bot: LucideBot,
  'brain-circuit': LucideBrainCircuit,
  check: LucideCheck,
  copy: LucideCopy,
  cpu: LucideCpu,
  'external-link': LucideExternalLink,
  flame: LucideFlame,
  gamepad: LucideGamepad2,
  ghost: LucideGhost,
  heart: LucideHeart,
  'log-out': LucideLogOut,
  moon: LucideMoon,
  pencil: LucidePencil,
  radar: LucideRadar,
  reply: LucideReply,
  rocket: LucideRocket,
  search: LucideSearch,
  send: LucideSend,
  share: LucideShare2,
  'shopping-bag': LucideShoppingBag,
  skull: LucideSkull,
  store: LucideStore,
  sun: LucideSun,
  swords: LucideSwords,
  user: LucideUserRound,
  'venetian-mask': LucideVenetianMask,
  'wand-sparkles': LucideWandSparkles,
  x: LucideX,
  zap: LucideZap
};

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [LucideDynamicIcon],
  template: `<svg [lucideIcon]="icon()" [size]="size()" [strokeWidth]="strokeWidth()"></svg>`
})
export class AppIconComponent {
  readonly name = input<AppIconName | string>('user');
  readonly size = input(20);
  readonly strokeWidth = input(2);
  readonly icon = computed(() => ICONS[this.name() as AppIconName] ?? ICONS.user);
}
