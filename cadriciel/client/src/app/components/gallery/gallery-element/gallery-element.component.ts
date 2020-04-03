import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Drawing } from '../../../../../../common/communication/drawing-interface';

@Component({
  selector: 'app-gallery-element',
  templateUrl: './gallery-element.component.html',
  styleUrls: ['./gallery-element.component.scss']
})
export class GalleryElementComponent {
  @Input() protected drawing: Drawing;
  @Input() protected isSelected: boolean;

  constructor(protected sanitizer: DomSanitizer) {}

  sanatize(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  getSelectionStatus(): string {
    return this.isSelected ? 'selected' : 'element-container';
  }

  getTags(): string[] {
    return (this.drawing.tags && this.drawing.tags.length !== 0) ? this.drawing.tags : ['aucune'];
  }

}
