import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { FallouBilanJournalierComponent } from './app/app';

bootstrapApplication(FallouBilanJournalierComponent, appConfig)
  .catch((err) => console.error(err));
