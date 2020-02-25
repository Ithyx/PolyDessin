import { DrawElement } from '../stockage-svg/draw-element';

export interface Commande {
    cleSVG?: number;  // id du SVG concerné
    element?: DrawElement; // élément concerné
    annuler(): void;
    refaire(): void;
}
