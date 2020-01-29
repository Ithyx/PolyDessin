import { Component, EventEmitter, Input, Output} from '@angular/core';
import { sujetVide } from '../../services/navigation-guide.service';
import { GuideSujet } from './guide-sujet';

@Component({
  selector: 'app-guide-sujet',
  templateUrl: './guide-sujet.component.html',
  styleUrls: ['./guide-sujet.component.scss']
})

export class GuideSujetComponent {

  @Input() noeud: GuideSujet = sujetVide;
  @Input() profondeur = 0;

  @Output() notification = new EventEmitter<GuideSujet>();

  getRange = (taille: number) => Array(taille);

  onClick() {
    if (this.noeud.sousSujets) {
      // c'est une catégorie: un click n'affiche pas la description, mais ouvre ou ferme la catégorie
      this.noeud.categorieOuverte = !this.noeud.categorieOuverte;
    } else {
      // c'est un sujet, on ouvre son contenu
      this.notification.emit(this.noeud);
    }
  }

  onNotify(sujet: GuideSujet) {
    this.notification.emit(sujet);
  }

}
