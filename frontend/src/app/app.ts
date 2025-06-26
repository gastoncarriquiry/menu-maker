import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OfflineIndicatorComponent } from './pwa/components/offline-indicator/offline-indicator';
import { UpdateNotificationComponent } from './pwa/components/update-notification/update-notification';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    OfflineIndicatorComponent,
    UpdateNotificationComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'Menu Maker';
}
