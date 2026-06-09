import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comment } from '../models';

@Component({
  selector: 'app-comment-card', standalone: true, imports: [FormsModule],
  template: `<article class="comment">
    <span class="avatar mini">{{ comment().user.avatar }}</span>
    <div><strong>{{ comment().user.name }}</strong><small>{{ comment().time }}</small><p>{{ comment().text }}</p>
      <button (click)="liked.emit(comment().id)" aria-label="Curtir comentário">♡ {{ comment().likes }}</button><button (click)="toggleReply()">Responder</button>
      @if (replying()) { <div class="reply-form"><input [(ngModel)]="replyText" placeholder="Escreva uma resposta"><button (click)="sendReply()">Enviar</button></div> }
      @for (reply of comment().replies ?? []; track reply.id) {
        <div class="reply"><b>{{ reply.user.avatar }} {{ reply.user.name }}</b><p>{{ reply.text }}</p></div>
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
