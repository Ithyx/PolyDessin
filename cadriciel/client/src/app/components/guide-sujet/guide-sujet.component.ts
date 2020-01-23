import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export class GuideSujet
{
  public nom: string;
  public description: string;
  public suivant: boolean;
  public precedant: boolean;
  public imagePaths?: string[];
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
  {
    nom: "ceci est une fraude",
    description: "<b>bonjour</b> c'est ici que je met mon argent pour éviter les <b>taxes</b>",
    suivant: true,
    precedant: false
  },
  {
    nom: "catégorie",
    description: "",
    suivant:false,
    precedant: false,
    sousSujets: [
        {
          nom: "sous-sujet1",
          description: "bidon",
          suivant: true,
          precedant: true,
        },
        {
          nom: "sous-sujet2",
          description: "++bidon",
          suivant: false,
          precedant: true,
          sousSujets: [
            {
              nom: "sous-sujet1",
              description: "bidon",
              suivant: true,
              precedant: true,
            },
            {
              nom: "sous-sujet2",
              description: "++bidon",
              suivant: false,
              precedant: true,
              sousSujets: [
                {
                  nom: "sous-sujet1",
                  description: "bidon",
                  suivant: true,
                  precedant: true,
                },
                {
                  nom: "sous-sujet2",
                  description: "++bidon",
                  suivant: false,
                  precedant: true,
                  sousSujets: [
                    {
                      nom: "sous-sujet1",
                      description: "bidon",
                      suivant: true,
                      precedant: true,
                    },
                    {
                      nom: "sous-sujet2",
                      description: "++bidon",
                      suivant: false,
                      precedant: true,
                    }
                ]
                }
            ]
            }
        ]
        }
    ]
  }
];
