import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Drawing } from '../../../../../../common/communication/drawing-interface';

@Component({
  selector: 'app-gallery-element',
  templateUrl: './gallery-element.component.html',
  styleUrls: ['./gallery-element.component.scss']
})
export class GalleryElementComponent {
  @Input() drawing: Drawing;
  @Input() isSelected: boolean;

  constructor(protected sanitizer: DomSanitizer) {}

  sanatize(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

}
