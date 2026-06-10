import { Component, output, signal } from '@angular/core';
import { AppIconComponent } from './app-icon.component';

@Component({
  selector: 'app-report-comment-modal',
  standalone: true,
  imports: [AppIconComponent],
  template: `<div class="comment-report-overlay" (click)="cancelled.emit()">
    <section class="comment-report-modal" role="dialog" aria-modal="true" aria-labelledby="report-comment-title" (click)="$event.stopPropagation()">
      <header>
        <span><app-icon name="flag" [size]="22"/></span>
        <div><small>DENUNCIAR COMENTÁRIO</small><h2 id="report-comment-title">Qual é o motivo da denúncia?</h2></div>
        <button type="button" aria-label="Fechar" (click)="cancelled.emit()"><app-icon name="x" [size]="18"/></button>
      </header>
      <p>Selecione a opção que melhor descreve o problema. Nossa equipe fará a análise.</p>
      <div class="comment-report-reasons">
        @for (reason of reasons; track reason) {
          <button type="button" [class.selected]="selected() === reason" (click)="selected.set(reason)">
            <span></span>{{ reason }}@if (selected() === reason) { <app-icon name="check" [size]="16"/> }
          </button>
        }
      </div>
      <footer>
        <button type="button" class="button secondary" (click)="cancelled.emit()">Cancelar</button>
        <button type="button" class="button report-submit" [disabled]="!selected()" (click)="submit()">Enviar denúncia</button>
      </footer>
    </section>
  </div>`
})
export class ReportCommentModalComponent {
  readonly cancelled = output<void>();
  readonly submitted = output<string>();
  readonly selected = signal('');
  readonly reasons = ['Spam ou publicidade', 'Ofensa ou assédio', 'Informação falsa', 'Conteúdo impróprio', 'Outro motivo'];

  submit(): void {
    if (this.selected()) this.submitted.emit(this.selected());
  }
}
