import { Injectable } from '@angular/core';
import { ParametresCouleurService } from '../couleur/parametres-couleur.service';
import { Command } from './command';

@Injectable({
  providedIn: 'root'
})
export class ChangeBackgroundColorService implements Command {
  oldColor: string;

  constructor(public color: ParametresCouleurService,
              public newColor: string) {
    this.oldColor = color.couleurFond;
    color.couleurFond = newColor;
  }

  undo() {
    this.color.couleurFond = this.oldColor;
  }

  redo() {
    this.color.couleurFond = this.newColor;
  }
}
