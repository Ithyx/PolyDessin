import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
//import { PageGuideComponent  } from "../page-guide/page-guide.component";

export class GuideSujet
{
  public nom: string;
  public description: string;
  public precedant: boolean;
  public suivant: boolean;
  public id?: number;
  public sousSujets?: GuideSujet[];
  public categorieOuverte?: boolean = false;
}

@Component({
  selector: 'app-guide-sujet',
  templateUrl: './guide-sujet.component.html',
  styleUrls: ['./guide-sujet.component.scss']
})
export class GuideSujetComponent implements OnInit {

  @Input() public noeud: GuideSujet;
  @Input() public profondeur: number = 0;

  @Output() notification = new EventEmitter<GuideSujet>();

  getRange = (number: number) => Array(number);
  
  onClick() {

    if (this.noeud.sousSujets) {
      /* c'est une catégorie: un click n'affiche pas la description, mais ouvre ou ferme la catégorie */
      this.noeud.categorieOuverte = !this.noeud.categorieOuverte;
    }
    else {
      /* c'est un sujet, on ouvre son contenu */
      this.notification.emit(this.noeud);
    }
  }

  onNotify(sujet: GuideSujet) {
    this.notification.emit(sujet);
  }
  
  ngOnInit() {
  }
  
}

//TODO: meilleure manière de construire des catégories (avec des ressources lue peut-être ?)
export const ContenuGuide: GuideSujet[] = [
    //Sujet 1
    {
      nom: "Bienvenue",
      id: 1,
      description: `<h1>Bienvenue à PolyDessin! </h1> 
                    <hr> 
                    <p> PolyDessin est un projet de 2ème année du génie logiciel à Polytechnique Montréal et consiste en une application web de dessin vectoriel. </p> 
                    <p> Vous vous trouvez présentement dans le guide d'utilisation. Celui-ci décrit et explique les différents outils implémentés.</p>
                    <img src="assets/poly.png">`,
      precedant: false,
      suivant: true
    },
    {
        nom: "Outils",
        description: "",
        precedant: false,
        suivant:false,
        sousSujets: [
            //Outil 1
            {
                nom: "Crayon",
                description: `<h1> Crayon </h1> 
                              <hr> 
                              <p> Le crayon est l'outil de traçage de base permettant de dessiner de simple trait avec une pointe roude.</p>
                              <p color="red"> insérer gif utilisation crayon ici </p>  
                              <p> Les paramètres personalisable sont: <li> Épaisseur du trait (en px) </li> </p>`,
                precedant: true,
                suivant: true,
                id: 2,
                categorieOuverte: true
            },
            //Outil 2
            {
                nom: "Pinceau",
                description: `<h1> Pinceau </h1> 
                              <hr> 
                              <p> Le pinceau est très similaire au crayon mais offre une texture supplémentaire.</p> 
                              <p> Les paramètres personalisable sont: <li> Épaisseur du trait (en px) </li> <li> Texture du trait </li> </p>`,
                precedant: true,
                suivant: true,
                id: 3,
                categorieOuverte: true
            },
            //Outil 3
            {
                nom: "Rectangle",
                description: `<h1> Rectangle </h1> 
                              Description du rectangle`,
                precedant: true,
                suivant: true,
                id: 4,
                categorieOuverte: true
            },
            //Outil 4
            {
                nom: "Ligne",
                description: `<h1> Ligne </h1> 
                              Description de la ligne`,
                precedant: true,
                suivant: true,
                id: 5,
                categorieOuverte: true
            },
            //Outil 5
            {
                nom: "Couleur",
                description: `<h1> Couleur </h1> 
                              Description du couleur`,
                precedant: true,
                suivant: true,
                id: 6,
                categorieOuverte: true
            },
            {
              nom: "Test",
              description: "",
              precedant: false,
              suivant: false,
              sousSujets: [
                {
                  nom: "Test 8",
                  id: 7,
                  description: "<h1> TEST 8 </h1>",
                  precedant: true,
                  suivant: true
                },
                {
                  nom: "Test 9",
                  id: 8,
                  description: "<h1> TEST 9 </h1>",
                  precedant: true,
                  suivant: true
                },
                {
                  nom: "Test 10",
                  id: 9,
                  description: "<h1> TEST 10 </h1>",
                  precedant: true,
                  suivant: true
                },
                {
                  nom: "Test 11",
                  id: 10,
                  description: "<h1> TEST 11 </h1>",
                  precedant: true,
                  suivant: false
                },
              ]
            }
        ]
    },
    
];
