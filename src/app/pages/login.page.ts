import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true, imports: [FormsModule, RouterLink],
  template: `<main class="auth-page"><a class="back" routerLink="/">←</a><section class="auth-card">
    <div class="brand center"><img src="assets/logo.svg" alt="CyberDrops"></div><div><p class="eyebrow">PLAYER ONE</p><h1>Entre no squad</h1><p class="muted">Sua próxima promoção está esperando.</p></div>
    <form routerLink="/home"><label>E-mail<input type="email" placeholder="voce@email.com"></label><label>Senha<input type="password" placeholder="Sua senha"></label><a class="text-link">Esqueceu sua senha?</a><button class="button primary wide">Entrar</button></form>
    <div class="divider"><span>ou continue com</span></div><div class="social"><button>Steam</button><button>Epic</button><button>Google</button></div>
    <p class="center muted">Ainda não tem conta? <a routerLink="/register">Criar conta</a></p>
  </section></main>`
})
export class LoginPage {}
