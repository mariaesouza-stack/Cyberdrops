import { Component, input } from '@angular/core';
import { Comment } from '../models';

@Component({
  selector: 'app-comment-card', standalone: true,
  template: `<article class="comment">
    <span class="avatar mini">{{ comment().user.avatar }}</span>
    <div><strong>{{ comment().user.name }}</strong><small>{{ comment().time }}</small><p>{{ comment().text }}</p>
      <button>♡ {{ comment().likes }}</button><button>Responder</button>
      @for (reply of comment().replies ?? []; track reply.id) {
        <div class="reply"><b>{{ reply.user.avatar }} {{ reply.user.name }}</b><p>{{ reply.text }}</p></div>
      }
    </div>
  </article>`
})
export class CommentCardComponent { readonly comment = input.required<Comment>(); }
