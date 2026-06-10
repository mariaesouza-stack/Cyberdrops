import { Component, output, signal } from '@angular/core';
import { AppIconComponent } from './app-icon.component';

@Component({
  selector: 'app-report-comment-modal',
  standalone: true,
  imports: [AppIconComponent],
  template: `<div class="comment-report-overlay" (click)="cancelled.emit()">
    <section class="comment-report-modal" role="dialog" aria-modal="true" aria-labelledby="report-comment-title" (click)="$event.stopPropagation()">
      <span class="comment-report-handle"></span>
      <header>
        <span class="comment-report-icon"><app-icon name="flag" [size]="21"/></span>
        <div><small>MODERAÇÃO DA COMUNIDADE</small><h2 id="report-comment-title">Denunciar comentário</h2></div>
        <button type="button" aria-label="Fechar" (click)="cancelled.emit()"><app-icon name="x" [size]="18"/></button>
      </header>
      <div class="comment-report-intro">
        <strong>Qual é o motivo da denúncia?</strong>
        <p>Selecione a opção que melhor descreve o problema. A denúncia será enviada de forma confidencial para análise.</p>
      </div>
      <div class="comment-report-reasons" role="radiogroup" aria-label="Motivos da denúncia">
        @for (reason of reasons; track reason) {
          <button type="button" role="radio" [attr.aria-checked]="selected() === reason.title" [class.selected]="selected() === reason.title" (click)="selected.set(reason.title)">
            <span class="comment-report-radio">@if (selected() === reason.title) { <i></i> }</span>
            <span class="comment-report-reason-copy"><b>{{ reason.title }}</b><small>{{ reason.description }}</small></span>
            @if (selected() === reason.title) { <app-icon name="check" [size]="16"/> }
          </button>
        }
      </div>
      <footer>
        <button type="button" class="button secondary" (click)="cancelled.emit()">Cancelar</button>
        <button type="button" class="button report-submit" [disabled]="!selected()" (click)="submit()"><app-icon name="flag" [size]="16"/>Enviar denúncia</button>
      </footer>
    </section>
  </div>`
})
export class ReportCommentModalComponent {
  readonly cancelled = output<void>();
  readonly submitted = output<string>();
  readonly selected = signal('');
  readonly reasons = [
    { title: 'Spam ou publicidade', description: 'Divulgação repetitiva, links suspeitos ou conteúdo promocional.' },
    { title: 'Ofensa ou assédio', description: 'Ataques pessoais, intimidação ou linguagem discriminatória.' },
    { title: 'Informação falsa', description: 'Informações enganosas sobre o produto, preço ou oferta.' },
    { title: 'Conteúdo impróprio', description: 'Conteúdo ofensivo, explícito ou inadequado para a comunidade.' },
    { title: 'Outro motivo', description: 'Um problema que não se encaixa nas opções anteriores.' }
  ];

  submit(): void {
    if (this.selected()) this.submitted.emit(this.selected());
  }
}
