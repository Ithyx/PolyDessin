import { Color, DrawElement } from '../../client/src/app/services/stockage-svg/draw-element';

export interface Drawing {
    _id: number;
    name: string;
    height: number;
    width: number;
    backgroundColor: Color;
    tags?: string[];
    elements?: DrawElement[];
}