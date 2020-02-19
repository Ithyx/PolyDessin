import { SafeHtml } from '@angular/platform-browser';

export interface ElementDessin {
  SVG: string;
  SVGHtml: SafeHtml;
  perimetre?: string;
  estSelectionne: boolean;
  dessiner(): void;
}
