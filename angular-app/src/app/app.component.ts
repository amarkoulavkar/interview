import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterOutlet],
  template: `
    <div class="app-shell">
      <aside class="left">
        <app-sidebar></app-sidebar>
      </aside>
      <main class="left">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `:host { display:block; height:100vh }
    .app-shell { display:grid; grid-template-columns:320px 1fr; height:100% }
    aside.left { border-right:1px solid #e6ebf5 }
    main.right { overflow:auto }
    `
  ]
})
export class AppComponent {
  title = 'Angular App';
}
