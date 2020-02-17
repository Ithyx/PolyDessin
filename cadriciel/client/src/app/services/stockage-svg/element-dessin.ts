import { SafeHtml } from '@angular/platform-browser';

export interface ElementDessin {
  SVG: SafeHtml;
  dessiner(): void;
}
