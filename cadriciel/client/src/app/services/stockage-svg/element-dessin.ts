import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../outils/dessin-ligne.service';

export interface ElementDessin {
  SVG: string;
  SVGHtml: SafeHtml;
  // transformationSVG: string;
  // transformationSVGHtml: SafeHtml;
  // nature de l'objet ? (Enum ?)

  points: Point[];

  couleurPrincipale?: string;
  couleurSecondaire?: string;

  perimetre?: string;
  estSelectionne: boolean;
  estPoint?: boolean;

  dessiner(): void;
}
