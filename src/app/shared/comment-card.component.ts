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
      <div class="comment-actions"><button (click)="liked.emit(comment().id)" aria-label="Curtir comentário"><app-icon name="heart" [size]="16"/> {{ comment().likes }}</button><button (click)="toggleReply()"><app-icon name="reply" [size]="16"/>Responder</button></div>
      @if (replying()) { <div class="reply-form"><input [(ngModel)]="replyText" placeholder="Escreva uma resposta"><button (click)="sendReply()" aria-label="Enviar resposta"><app-icon name="send" [size]="16"/></button></div> }
      @for (reply of comment().replies ?? []; track reply.id) {
        <div class="reply"><b><span class="avatar reply-avatar"><app-avatar [src]="reply.user.avatar" [alt]="'Avatar de ' + reply.user.name"/></span>{{ reply.user.name }}</b><p>{{ reply.text }}</p></div>
      }
    </div>
  </article>`
})
export class CommentCardComponent {
  readonly comment = input.required<Comment>(); readonly liked = output<number>(); readonly replied = output<{ commentId: number; text: string }>();
  readonly replying = signal(false); replyText = '';
  toggleReply(): void { this.replying.update(value => !value); }
  sendReply(): void { if (!this.replyText.trim()) return; this.replied.emit({ commentId: this.comment().id, text: this.replyText.trim() }); this.replyText = ''; this.replying.set(false); }
}
