import { Component, input, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Comment } from "../models";
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
  readonly reported = input(false);
  readonly likedByUser = input(false);
  readonly liked = output<number>();
  readonly replied = output<{ commentId: number; text: string }>();
  readonly deleted = output<number>();
  readonly reportedComment = output<number>();
  readonly replying = signal(false);
  readonly confirmingDelete = signal(false);
  replyText = "";
  isOwner(): boolean {
    return this.comment().user.id === this.currentUserId();
  }
  toggleReply(): void {
    this.replying.update((value) => !value);
  }
  requestDelete(): void {
    if (this.confirmingDelete()) {
      this.deleted.emit(this.comment().id);
      return;
    }
    this.confirmingDelete.set(true);
    setTimeout(() => this.confirmingDelete.set(false), 3000);
  }
  sendReply(): void {
    if (!this.replyText.trim()) return;
    this.replied.emit({
      commentId: this.comment().id,
      text: this.replyText.trim(),
    });
    this.replyText = "";
    this.replying.set(false);
  }
}
