import { Component, input, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Comment, User } from "../models";
import { AppAvatarComponent } from "./app-avatar.component";
import { AppIconComponent } from "./app-icon.component";

@Component({
  selector: "app-comment-card",
  standalone: true,
  imports: [FormsModule, AppIconComponent, AppAvatarComponent],
  templateUrl: "./comment-card.component.html",
})
export class CommentCardComponent {
  readonly comment = input.required<Comment>();
  readonly currentUserId = input.required<number>();
  readonly currentUser = input<User>();
  readonly reported = input(false);
  readonly reportedReplyIds = input<number[]>([]);
  readonly likedByUser = input(false);
  readonly liked = output<number>();
  readonly replied = output<{ commentId: number; text: string }>();
  readonly deleted = output<number>();
  readonly reportedComment = output<number>();
  readonly deletedReply = output<{ commentId: number; replyId: number }>();
  readonly reportedReply = output<{ commentId: number; replyId: number }>();
  readonly threadOpen = signal(false);
  readonly confirmingDelete = signal(false);
  readonly confirmingReplyDelete = signal<number | undefined>(undefined);
  replyText = "";

  isOwner(): boolean {
    return this.comment().user.id === this.currentUserId();
  }

  openThread(): void {
    this.threadOpen.set(true);
  }

  closeThread(): void {
    this.threadOpen.set(false);
  }

  replyCount(): number {
    return this.comment().replies?.length || 0;
  }

  threadButtonLabel(): string {
    const count = this.replyCount();
    return `Abrir ${count} ${count === 1 ? "resposta" : "respostas"}`;
  }

  requestDelete(): void {
    if (this.confirmingDelete()) {
      this.deleted.emit(this.comment().id);
      return;
    }
    this.confirmingDelete.set(true);
    setTimeout(() => this.confirmingDelete.set(false), 3000);
  }
  requestReplyDelete(replyId: number): void {
    if (this.confirmingReplyDelete() === replyId) {
      this.deletedReply.emit({ commentId: this.comment().id, replyId });
      this.confirmingReplyDelete.set(undefined);
      return;
    }
    this.confirmingReplyDelete.set(replyId);
    setTimeout(() => {
      if (this.confirmingReplyDelete() === replyId)
        this.confirmingReplyDelete.set(undefined);
    }, 3000);
  }
  isReplyOwner(reply: Comment): boolean {
    return reply.user.id === this.currentUserId();
  }
  isReplyReported(replyId: number): boolean {
    return this.reportedReplyIds().includes(replyId);
  }
  sortedReplies(): Comment[] {
    return [...(this.comment().replies || [])].sort(
      (a, b) => b.likes - a.likes || b.id - a.id,
    );
  }
  sendReply(): void {
    if (!this.replyText.trim()) return;
    this.replied.emit({
      commentId: this.comment().id,
      text: this.replyText.trim(),
    });
    this.replyText = "";
  }
}
