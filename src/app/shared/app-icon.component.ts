import { Component, computed, input } from "@angular/core";
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideBell,
  LucideBadgePercent,
  LucideBookmark,
  LucideBookmarkCheck,
  LucideBot,
  LucideBrainCircuit,
  LucideCheck,
  LucideCheckCheck,
  LucideClock,
  LucideCopy,
  LucideCpu,
  LucideDynamicIcon,
  LucideExternalLink,
  LucideFilter,
  LucideFlag,
  LucideFlame,
  LucideGamepad2,
  LucideGhost,
  LucideHeart,
  LucideImageUp,
  LucideLogOut,
  LucideMoon,
  LucideMessageCircle,
  LucidePackageCheck,
  LucidePencil,
  LucidePlus,
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
  LucideTicketPercent,
  LucideTrendingDown,
  LucideTrash2,
  LucideUserRound,
  LucideVenetianMask,
  LucideWandSparkles,
  LucideX,
  LucideZap,
  type LucideIcon,
} from "@lucide/angular";

export type AppIconName =
  | "arrow-left"
  | "arrow-right"
  | "bell"
  | "bookmark"
  | "bookmark-check"
  | "badge-percent"
  | "bot"
  | "brain-circuit"
  | "check"
  | "check-check"
  | "clock"
  | "copy"
  | "cpu"
  | "external-link"
  | "filter"
  | "flag"
  | "flame"
  | "gamepad"
  | "ghost"
  | "heart"
  | "image-up"
  | "log-out"
  | "moon"
  | "pencil"
  | "message-circle"
  | "package-check"
  | "plus"
  | "radar"
  | "reply"
  | "rocket"
  | "search"
  | "send"
  | "share"
  | "shopping-bag"
  | "skull"
  | "store"
  | "sun"
  | "swords"
  | "ticket-percent"
  | "trash"
  | "trending-down"
  | "user"
  | "venetian-mask"
  | "wand-sparkles"
  | "x"
  | "zap";

const ICONS: Record<AppIconName, LucideIcon> = {
  "arrow-left": LucideArrowLeft,
  "arrow-right": LucideArrowRight,
  bell: LucideBell,
  "badge-percent": LucideBadgePercent,
  bookmark: LucideBookmark,
  "bookmark-check": LucideBookmarkCheck,
  bot: LucideBot,
  "brain-circuit": LucideBrainCircuit,
  check: LucideCheck,
  "check-check": LucideCheckCheck,
  clock: LucideClock,
  copy: LucideCopy,
  cpu: LucideCpu,
  "external-link": LucideExternalLink,
  filter: LucideFilter,
  flag: LucideFlag,
  flame: LucideFlame,
  gamepad: LucideGamepad2,
  ghost: LucideGhost,
  heart: LucideHeart,
  "image-up": LucideImageUp,
  "log-out": LucideLogOut,
  moon: LucideMoon,
  "message-circle": LucideMessageCircle,
  "package-check": LucidePackageCheck,
  pencil: LucidePencil,
  plus: LucidePlus,
  radar: LucideRadar,
  reply: LucideReply,
  rocket: LucideRocket,
  search: LucideSearch,
  send: LucideSend,
  share: LucideShare2,
  "shopping-bag": LucideShoppingBag,
  skull: LucideSkull,
  store: LucideStore,
  sun: LucideSun,
  swords: LucideSwords,
  "ticket-percent": LucideTicketPercent,
  trash: LucideTrash2,
  "trending-down": LucideTrendingDown,
  user: LucideUserRound,
  "venetian-mask": LucideVenetianMask,
  "wand-sparkles": LucideWandSparkles,
  x: LucideX,
  zap: LucideZap,
};

@Component({
  selector: "app-icon",
  standalone: true,
  imports: [LucideDynamicIcon],
  templateUrl: "./app-icon.component.html",
})
export class AppIconComponent {
  readonly name = input<AppIconName | string>("user");
  readonly size = input(20);
  readonly strokeWidth = input(2);
  readonly icon = computed(
    () => ICONS[this.name() as AppIconName] ?? ICONS.user,
  );
}
