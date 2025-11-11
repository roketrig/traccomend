import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // ← appConfig import ediliyor mu?
import { App } from './app/app';

bootstrapApplication(App, appConfig) // ← appConfig kullanılıyor mu?
  .catch((err) => console.error(err));