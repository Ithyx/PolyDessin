import { DrawElement } from '../stockage-svg/draw-element';

export interface Commande {
    SVGKey?: number;  // id du SVG concerné
    element?: DrawElement; // élément concerné
    undo(): void;
    redo(): void;
}
