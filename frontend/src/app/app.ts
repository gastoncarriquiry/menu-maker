import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OfflineIndicatorComponent } from './pwa/components/offline-indicator/offline-indicator';
import { UpdateNotificationComponent } from './pwa/components/update-notification/update-notification';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    OfflineIndicatorComponent,
    UpdateNotificationComponent,
    ThemeToggleComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'Menu Maker';
}
