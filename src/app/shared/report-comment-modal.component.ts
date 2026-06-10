import { Component, output, signal } from "@angular/core";
import { AppIconComponent } from "./app-icon.component";

@Component({
  selector: "app-report-comment-modal",
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: "./report-comment-modal.component.html",
})
export class ReportCommentModalComponent {
  readonly cancelled = output<void>();
  readonly submitted = output<string>();
  readonly selected = signal("");
  readonly reasons = [
    {
      title: "Spam ou publicidade",
      description:
        "Divulgação repetitiva, links suspeitos ou conteúdo promocional.",
    },
    {
      title: "Ofensa ou assédio",
      description:
        "Ataques pessoais, intimidação ou linguagem discriminatória.",
    },
    {
      title: "Informação falsa",
      description: "Informações enganosas sobre o produto, preço ou oferta.",
    },
    {
      title: "Conteúdo impróprio",
      description:
        "Conteúdo ofensivo, explícito ou inadequado para a comunidade.",
    },
    {
      title: "Outro motivo",
      description: "Um problema que não se encaixa nas opções anteriores.",
    },
  ];

  submit(): void {
    if (this.selected()) this.submitted.emit(this.selected());
  }
}
