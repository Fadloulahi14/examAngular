import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { FallouBilanJournalierComponent } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(FallouBilanJournalierComponent, config, context);

export default bootstrap;
