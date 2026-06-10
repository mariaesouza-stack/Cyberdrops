import { Component, effect, input, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DealPublicationDraft } from "../models";
import { AppIconComponent } from "./app-icon.component";

@Component({
  selector: "app-create-deal-item-form",
  standalone: true,
  imports: [FormsModule, AppIconComponent],
  templateUrl: "./create-deal-item-form.component.html",
})
export class CreateDealItemFormComponent {
  readonly submitted = output<DealPublicationDraft>();
  readonly initial = input<DealPublicationDraft>();
  readonly imageError = signal("");
  draft: DealPublicationDraft = {
    type: "deal",
    title: "",
    store: "",
    url: "",
    price: 0,
    oldPrice: 0,
    category: "Games",
    image: "",
    description: "",
  };
  constructor() {
    effect(() => {
      const initial = this.initial();
      if (initial) this.draft = { ...initial };
    });
  }
  selectImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      this.imageError.set("Selecione uma imagem JPEG, PNG ou WebP.");
      input.value = "";
      return;
    }
    if (file.size > 1024 * 1024) {
      this.imageError.set("A imagem deve ter no máximo 1 MB.");
      input.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.draft.image = String(reader.result || "");
      this.imageError.set("");
    };
    reader.onerror = () =>
      this.imageError.set("Não foi possível carregar esta imagem.");
    reader.readAsDataURL(file);
  }
  submit(): void {
    if (
      !this.draft.title.trim() ||
      !this.draft.store.trim() ||
      !this.draft.url.trim() ||
      !this.draft.image.trim() ||
      !this.draft.description.trim() ||
      this.draft.oldPrice <= this.draft.price
    )
      return;
    this.submitted.emit({
      ...this.draft,
      title: this.draft.title.trim(),
      store: this.draft.store.trim(),
      url: this.draft.url.trim(),
      image: this.draft.image.trim(),
      description: this.draft.description.trim(),
    });
  }
}
