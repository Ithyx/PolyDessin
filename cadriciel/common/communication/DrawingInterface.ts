import { DrawElement } from '../../client/src/app/services/stockage-svg/draw-element';

export interface Drawing {
    _id: number;
    name: string;
    height: number;
    width: number;
    backgroundColor: string;
    tags?: string[];
    elements?: DrawElement[];
}