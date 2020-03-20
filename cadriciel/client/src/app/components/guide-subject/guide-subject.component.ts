import { Component, EventEmitter, Input, Output} from '@angular/core';
import { EMPTY_SUBJECT} from '../../services/navigation-guide.service';
import { SubjectGuide } from './subject-guide';

@Component({
  selector: 'app-guide-subject',
  templateUrl: './guide-subject.component.html',
  styleUrls: ['./guide-subject.component.scss']
})

export class GuideSubjectComponent {

  @Input() private node: SubjectGuide;
  @Input() protected depth: number;

  @Output() private notification: EventEmitter<SubjectGuide>;

  constructor() {
    this.node = EMPTY_SUBJECT;
    this.depth = 0;
    this.notification = new EventEmitter<SubjectGuide>();
  }

  getRange = (size: number) => Array(size);

  onClick(): void {
    if (this.node.subSubjects) {
      // c'est une catégorie: un click n'affiche pas la description, mais ouvre ou ferme la catégorie
      this.node.openCategory = !this.node.openCategory;
    } else {
      // c'est un sujet, on ouvre son contenu
      this.notification.emit(this.node);
    }
  }

  notificationReceived(subject: SubjectGuide): void {
    this.notification.emit(subject);
  }

}
