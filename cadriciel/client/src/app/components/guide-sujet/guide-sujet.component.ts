import { Component, EventEmitter, Input, Output} from '@angular/core';
import { EMPTY_SUBJECT} from '../../services/navigation-guide.service';
import { SubjectGuide } from './guide-sujet';

@Component({
  selector: 'app-guide-sujet',
  templateUrl: './guide-sujet.component.html',
  styleUrls: ['./guide-sujet.component.scss']
})

export class GuideSujetComponent {

  @Input() noeud: SubjectGuide = EMPTY_SUBJECT;
  @Input() profondeur = 0;

  @Output() notification = new EventEmitter<SubjectGuide>();

  getRange = (taille: number) => Array(taille);

  clic() {
    if (this.noeud.subSubjects) {
      // c'est une catégorie: un click n'affiche pas la description, mais ouvre ou ferme la catégorie
      this.noeud.openCategory = !this.noeud.openCategory;
    } else {
      // c'est un sujet, on ouvre son contenu
      this.notification.emit(this.noeud);
    }
  }

  notificationRecu(sujet: SubjectGuide) {
    this.notification.emit(sujet);
  }

}
