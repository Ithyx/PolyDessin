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
      console.log('click: ', click.offsetX, click.offsetY, click);
      const SVG = '<circle cx="' + click.offsetX + '" cy="' + click.offsetY + '" r="5" fill="red"/>';
      this.stockage.ajouterSVG(SVG);
    }
  }

}
