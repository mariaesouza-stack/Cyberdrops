import { Component, HostListener, input, output, signal } from "@angular/core";
import { AppIconComponent } from "./app-icon.component";

export interface PublicationDropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: "app-publication-dropdown",
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: "./publication-dropdown.component.html",
})
export class PublicationDropdownComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly options = input.required<readonly PublicationDropdownOption[]>();
  readonly changed = output<string>();
  readonly open = signal(false);

  @HostListener("document:click")
  close(): void {
    this.open.set(false);
  }

  toggle(event: Event): void {
    event.stopPropagation();
    this.open.update((isOpen) => !isOpen);
  }

  select(option: PublicationDropdownOption, event: Event): void {
    event.stopPropagation();
    this.changed.emit(option.value);
    this.open.set(false);
  }

  selectedLabel(): string {
    return (
      this.options().find((option) => option.value === this.value())?.label ||
      "Selecione"
    );
  }
}
