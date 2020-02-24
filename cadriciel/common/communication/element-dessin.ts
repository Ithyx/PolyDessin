import { SafeHtml } from '../../client/@angular/platform-browser';
import { Point } from '../../client/src/app/services/outils/dessin-ligne.service';

export interface ElementDessin {
  SVG: string;
  SVGHtml: SafeHtml;
  // transformationSVG: string;
  // transformationSVGHtml: SafeHtml;

  points: Point[];

  couleurPrincipale?: string;
  couleurSecondaire?: string;

  texture?: string;
  epaisseur?: number;
  perimetre?: string;
  estSelectionne: boolean;
  estPoint?: boolean;

  dessiner(): void;
}
