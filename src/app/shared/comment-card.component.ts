import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comment } from '../models';
import { AppAvatarComponent } from './app-avatar.component';
import { AppIconComponent } from './app-icon.component';

@Component({
  selector: 'app-comment-card', standalone: true, imports: [FormsModule, AppIconComponent, AppAvatarComponent],
  template: `<article class="comment">
    <span class="avatar mini"><app-avatar [src]="comment().user.avatar" [alt]="'Avatar de ' + comment().user.name"/></span>
    <div><strong>{{ comment().user.name }}</strong><small>{{ comment().time }}</small><p>{{ comment().text }}</p>
      <div class="comment-actions">
        <button class="comment-like" [class.active]="likedByUser()" (click)="liked.emit(comment().id)" aria-label="Curtir comentário"><app-icon name="heart" [size]="16"/> {{ comment().likes }}</button>
        <button (click)="toggleReply()"><app-icon name="reply" [size]="16"/>Responder</button>
        @if (isOwner()) {
          <button class="comment-delete" [class.confirming]="confirmingDelete()" (click)="requestDelete()">
            <app-icon name="trash" [size]="16"/>{{ confirmingDelete() ? 'Confirmar' : 'Apagar' }}
          </button>
        } @else {
          <button class="comment-report" [class.reported]="reported()" [disabled]="reported()" (click)="reportedComment.emit(comment().id)">
            <app-icon [name]="reported() ? 'check' : 'flag'" [size]="16"/>{{ reported() ? 'Denunciado' : 'Denunciar' }}
          </button>
        }
      </div>
      @if (replying()) { <div class="reply-form"><input [(ngModel)]="replyText" placeholder="Escreva uma resposta"><button (click)="sendReply()" aria-label="Enviar resposta"><app-icon name="send" [size]="16"/></button></div> }
      @for (reply of comment().replies ?? []; track reply.id) {
        <div class="reply"><b><span class="avatar reply-avatar"><app-avatar [src]="reply.user.avatar" [alt]="'Avatar de ' + reply.user.name"/></span>{{ reply.user.name }}</b><p>{{ reply.text }}</p></div>
      }
    </div>
  </article>`
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
  replyText = '';
  isOwner(): boolean { return this.comment().user.id === this.currentUserId(); }
  toggleReply(): void { this.replying.update(value => !value); }
  requestDelete(): void {
    if (this.confirmingDelete()) {
      this.deleted.emit(this.comment().id);
      return;
    }
    this.confirmingDelete.set(true);
    setTimeout(() => this.confirmingDelete.set(false), 3000);
  }
  sendReply(): void { if (!this.replyText.trim()) return; this.replied.emit({ commentId: this.comment().id, text: this.replyText.trim() }); this.replyText = ''; this.replying.set(false); }
}
