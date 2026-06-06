import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { BottomNavigationComponent } from './shared/bottom-navigation.component';
import { HeaderComponent } from './shared/header.component';

@Component({
  selector: 'app-root', standalone: true, imports: [RouterOutlet, HeaderComponent, BottomNavigationComponent],
  template: `@if (showChrome()) { <app-header/> }<router-outlet/>@if (showChrome()) { <app-bottom-navigation/> }`
})
export class AppComponent {
  readonly showChrome = signal(false);
  constructor(router: Router) {
    const update = (url: string) => this.showChrome.set(!['/', '/login', '/register'].includes(url.split('?')[0]));
    update(router.url);
    router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => update(event.urlAfterRedirects));
  }
}
