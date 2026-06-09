import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { AppAvatarComponent } from '../shared/app-avatar.component';
import { AppIconComponent } from '../shared/app-icon.component';
import { AvatarPickerComponent } from '../shared/avatar-picker.component';

@Component({
  standalone: true, imports: [RouterLink, AvatarPickerComponent, AppIconComponent, AppAvatarComponent],
  template: `<section class="page avatar-page"><a class="back" routerLink="/profile" aria-label="Voltar"><app-icon name="arrow-left" [size]="20"/></a><p class="eyebrow">IDENTIDADE VISUAL</p><h1>Escolha seu avatar cyber</h1><p class="muted">Mostre seu estilo para a comunidade.</p><div class="avatar-preview avatar"><app-avatar [src]="selected()" alt="Prévia do avatar cyber"/></div><app-avatar-picker [selected]="selected()" (picked)="selected.set($event)"/><button class="button primary wide" (click)="save()">Salvar avatar</button></section>`
})
export class AvatarPage {
  readonly service = inject(UserService); readonly router = inject(Router); readonly selected = signal(this.service.user().avatar);
  save(): void { this.service.setAvatar(this.selected()); this.router.navigateByUrl('/profile'); }
}
