import { Component } from '@angular/core';
import { StockageSvgService } from 'src/app/services/stockage-svg.service';
import { OutilDessin } from '../outil-dessin/outil-dessin.component';

@Component({
  selector: 'app-page-dessin',
  templateUrl: './page-dessin.component.html',
  styleUrls: ['./page-dessin.component.scss']
})
export class PageDessinComponent {

  outilActif: OutilDessin = {
    nom: 'Crayon',
    estActif: true,
    idOutil: 0,
    parametres: [
      {type: 'number', nom: 'Épaisseur'}
    ]
  };

  constructor(private stockage: StockageSvgService) { }

  onNotify(outil: OutilDessin) {
    console.log('nouvel outil sélectionné: ', outil)
    this.outilActif = outil;
  }

  onClick(click: MouseEvent) {
    if (this.outilActif.nom === 'Crayon') {
      // Rien à faire ?
    }
  }

  onMouseMove(mouse: MouseEvent) {
    if (this.outilActif.nom === 'Crayon' && mouse.buttons === 1) {
      let crayon: string = this.stockage.getSVGEnCours();
      if (crayon === '') { return; };
      crayon += 'L' + mouse.offsetX + ' ' + mouse.offsetY + ' "/>';
      this.stockage.setSVGEnCours(crayon);
    }
  }

  onMousePress(mouse: MouseEvent) {
    if (this.outilActif.nom === 'Crayon') {
      this.stockage.setSVGEnCours('<path fill="transparent" stroke="black" d="M' + mouse.offsetX + ' ' + mouse.offsetY + '"/>');
    }
  }

  onMouseRelease(mouse: MouseEvent) {
    if (this.outilActif.nom === 'Crayon') {
      this.stockage.ajouterSVG(this.stockage.getSVGEnCours() + '"/>');
      this.stockage.setSVGEnCours('');
    }
  }

  onMouseLeave(mouse: MouseEvent) {
    if (this.outilActif.nom === 'Crayon') {
      this.stockage.ajouterSVG(this.stockage.getSVGEnCours() + '"/>');
      this.stockage.setSVGEnCours('');
    }
  }

}
