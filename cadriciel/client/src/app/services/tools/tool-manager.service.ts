import { Injectable } from '@angular/core';

export enum TOOL_INDEX {
  PENCIL = 0,
  BRUSH,          // 1
  SPRAY,          // 2
  RECTANGLE,      // 3
  POLYGON,        // 4
  LINE,           // 5
  SELECTION,      // 6
  PIPETTE,        // 7
  ELLIPSE,        // 8
  COLOR_CHANGER,  // 9
  ERASER          // 10
}

export interface ToolParameter {
  type: string;
  name: string;
  options?: string[];
  chosenOption?: string;
  value?: number;
  min?: number;
  max?: number;
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
      {type: 'number', name: 'Épaisseur', value: 5, min: 1, max: 100}
    ]
  },
  {
    name: 'Pinceau',
    isActive: false,
    ID: 1,
    iconName: 'fas fa-paint-brush',
    parameters: [
      {type: 'number', name: 'Épaisseur', value: 5, min: 1, max: 100},
      {type: 'select', name: 'Texture', chosenOption: 'Flou', options: ['Flou', 'Ombre', 'Surbrillance', 'Tache', 'Tremblant']}
    ]
  },
  {
    name: 'Aérosol',
    isActive: false,
    ID: 2,
    iconName: 'fas fa-spray-can',
    parameters: [
      { type: 'number', name: 'Diamétre du jet', value: 20, min: 5, max: 100 },
      { type: 'number', name: 'Nombre d\'émissions par seconde', value: 100, min: 1, max: 200 }
    ]
  },
  {
    name: 'Rectangle',
    isActive: false,
    ID: 3,
    iconName: 'far fa-square',
    parameters: [
      {type: 'number', name: 'Épaisseur du contour', value: 5, min: 1, max: 100},
      {type: 'select', name: 'Type de tracé', chosenOption: 'Contour', options: ['Contour', 'Plein', 'Plein avec contour']}
    ]
  },
  {
    name: 'Polygone',
    isActive: false,
    ID: 4,
    iconName: 'fab fa-jira',
    parameters: [
      {type: 'number', name: 'Épaisseur du contour', value: 5, min: 1, max: 100},
      {type: 'select', name: 'Type de tracé', chosenOption: 'Contour', options: ['Contour', 'Plein', 'Plein avec contour']},
      {type: 'number', name: 'Nombre de côtés', value: 4, min: 3, max: 12}
    ]
  },
  {
    name: 'Ligne',
    isActive: false,
    ID: 5,
    iconName: 'fas fa-vector-square',
    parameters: [
      {type: 'number', name: 'Épaisseur', value: 5, min: 1, max: 100},
      {type: 'select', name: 'Type de jonction', chosenOption: 'Avec points', options: ['Avec points', 'Sans points']},
      {type: 'number', name: 'Diamètre des jonctions', value: 5, min: 1, max: 100}
    ]
  },
  {
    name: 'Selection',
    isActive: false,
    ID: 6,
    iconName: 'far fa-object-group',
    parameters: [
      { type: 'invisible', name: 'Épaisseur', value: 3, min: 1, max: 100 },
      { type: 'invisible', name: 'Type de tracé', chosenOption: 'Contour'}
    ]
  },
  {
    name: 'Pipette',
    isActive: false,
    ID: 7,
    iconName: 'fas fa-eye-dropper',
    parameters: []
  },
  {
    name: 'Ellipse',
    isActive: false,
    ID: 8,
    iconName: 'far fa-circle',
    parameters: [
      {type: 'number', name: 'Épaisseur du contour', value: 5, min: 1, max: 100},
      {type: 'select', name: 'Type de tracé', chosenOption: 'Contour', options: ['Contour', 'Plein', 'Plein avec contour']}
    ]
  },
  {
    name: 'Applicateur Couleur',
    isActive: false,
    ID: 9,
    iconName: 'fas fa-tint',
    parameters: []
  },
  {
    name: 'Efface',
    isActive: false,
    ID: 10,
    iconName: 'fas fa-eraser',
    parameters: [{type: 'number', name: 'Épaisseur de l\'efface', value: 10, min: 3, max: 50}]
  }
];
