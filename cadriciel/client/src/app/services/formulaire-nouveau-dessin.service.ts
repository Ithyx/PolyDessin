import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'

@Injectable({
  providedIn: 'root'
})
export class FormulaireNouveauDessinService {

  constructor(){ }

  formulaire: FormGroup = new FormGroup({
    hauteur: new FormControl(null),
    largeur: new FormControl(null),
    couleur_de_fond: new FormControl(0xFFFFFF)
  });
}
