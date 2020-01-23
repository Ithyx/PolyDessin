import { Component, OnInit, Input } from '@angular/core';

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

  getRange = (number: number) => Array(number);
  
  onClick() {
    if (this.noeud.sousSujets) {
      /* c'est une catégorie: un click n'affiche pas la description, mais ouvre ou ferme la catégorie */
      this.noeud.categorieOuverte = !this.noeud.categorieOuverte;
    }
    else {
      /* c'est un sujet, on ouvre son contenu */
      //TODO: notifier la page guide qu'un sujet à été ouvert
    }
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
