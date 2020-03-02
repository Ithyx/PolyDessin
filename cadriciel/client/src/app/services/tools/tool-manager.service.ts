import { Injectable } from '@angular/core';

export enum TOOL_INDEX {
  PENCIL = 0,
  BRUSH,
  RECTANGLE,
  LINE,
  SELECTION,
  SPRAY
}

export interface ToolParameter {
  type: string;
  name: string;
  options?: string[];
  chosenOption?: string;
  value?: number;
}

export interface DrawingTool {
  name: string;
  isActive: boolean;
  ID: number;
  parameters: ToolParameter[];
  iconName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToolManagerService {
  activeTool: DrawingTool = TOOL_LIST[0];
  toolList: DrawingTool[] = TOOL_LIST;

  findParameterIndex(name: string): number {
    for (let i = 0; i < this.activeTool.parameters.length; i++) {
      if ( this.activeTool.parameters[i].name === name) {
        return i;
      }
    }
    // Autrement on renvoie le premier parametre de l'outil
    return 0;
  }

  changeActiveTool(index: number): void {
    // On vérifie qu'on essaye d'accéder à un index valide
    if (index <= this.toolList.length) {
      this.activeTool.isActive = false;
      this.activeTool = this.toolList[index];
      this.activeTool.isActive = true;
    }
  }
}

export const EMPTY_TOOL: DrawingTool = {name: 'defaut', isActive: false, ID: -1, parameters: [], iconName: ''};

export const TOOL_LIST: DrawingTool[] = [
  {
    name: 'Crayon',
    isActive: true,
    ID: 0,
    iconName: 'fas fa-pencil-alt',
    parameters: [
      {type: 'number', name: 'Épaisseur', value: 5}
    ]
  },
  {
    name: 'Pinceau',
    isActive: false,
    ID: 1,
    iconName: 'fas fa-paint-brush',
    parameters: [
      {type: 'number', name: 'Épaisseur', value: 5},
      {type: 'select', name: 'Texture', chosenOption: 'Flou', options: ['Flou', 'Ombre', 'Surbrillance', 'Tache', 'Tremblant']}
    ]
  },
  {
    name: 'Rectangle',
    isActive: false,
    ID: 2,
    iconName: 'far fa-square',
    parameters: [
      {type: 'number', name: 'Épaisseur du contour', value: 5},
      {type: 'select', name: 'Type de tracé', chosenOption: 'Contour', options: ['Contour', 'Plein', 'Plein avec contour']}
    ]
  },
  {
    name: 'Ligne',
    isActive: false,
    ID: 3,
    iconName: 'fas fa-vector-square',
    parameters: [
      {type: 'number', name: 'Épaisseur', value: 5},
      {type: 'select', name: 'Type de jonction', chosenOption: 'Avec points', options: ['Avec points', 'Sans points']},
      {type: 'number', name: 'Diamètre des jonctions', value: 5}
    ]
  },
  {
    name: 'Selection',
    isActive: false,
    ID: 4,
    iconName: 'fas fa-vector-square',
    parameters: [
      { type: 'invisible', name: 'Épaisseur', value: 1 },
      { type: 'invisible', name: 'Type de tracé', chosenOption: 'Contour'}
    ]
  },
  {
    name: 'Aérosol',
    isActive: false,
    ID: 5,
    iconName: 'fas fa-spray-can',
    parameters: [
      { type: 'number', name: 'Diamétre du jet', value: 20 },
      { type: 'number', name: 'Nombre d\'émissions par seconde', value: 100 }
    ]
  }
];
