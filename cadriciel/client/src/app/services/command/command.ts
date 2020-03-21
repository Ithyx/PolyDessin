import { DrawElement } from '../stockage-svg/draw-element';

export interface Command {
    element?: DrawElement; // élément concerné
    undo(): void;
    redo(): void;
}
