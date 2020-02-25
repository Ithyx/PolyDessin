import { ElementDessin } from '../stockage-svg/element-dessin';

export interface Commande {
    cleSVG?: number;  // id du SVG concerné
    element?: ElementDessin; // élément concerné
    annuler(): void;
    refaire(): void;
}
