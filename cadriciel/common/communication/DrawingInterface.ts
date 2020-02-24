import { ElementDessin } from './element-dessin';

export interface Drawing {
    name: string;
    height: number;
    width: number;
    backgroundColor: string;
    tags?: string[];
    elements?: ElementDessin[];
}