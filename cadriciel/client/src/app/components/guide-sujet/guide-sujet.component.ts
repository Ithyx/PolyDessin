import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export class GuideSujet
{
  public nom: string;
  public description: string;
  public precedant: boolean;
  public suivant: boolean;
  public id?: number;
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
    //Sujet 1
    {
      nom: "Bienvenue",
      id: 1,
      description: "<h1>Bienvenue à PolyDessin! </h1> ceci est une description. En tant qu'utilisateur, je dois pouvoir consulter un guide d'utilisation de l'application.",
      precedant: false,
      suivant: true
    },
    //Sujet 1
    {
      nom: "Bienvenue2",
      id: 2,
      description: "<h1> TEST BIENVENUE 2 </h1>",
      precedant: true,
      suivant: true
    },
    //Sujet 2
    {
        nom: "Outils",
        description: "",
        precedant: false,
        suivant:false,
        sousSujets: [
            //Outil 1
            {
                nom: "Crayon",
                description: "<h1> Crayon </h1> Description du crayon",
                precedant: true,
                suivant: true,
                id: 3
            },
            //Outil 2
            {
                nom: "Pinceau",
                description: "<h1> Pinceau </h1> Description du pinceau",
                precedant: true,
                suivant: true,
                id: 4
            },
            //Outil 3
            {
                nom: "Rectangle",
                description: "<h1> Rectangle </h1> Description du rectangle",
                precedant: true,
                suivant: true,
                id: 5
            },
            //Outil 4
            {
                nom: "Ligne",
                description: "<h1> Ligne </h1> Description du ligne",
                precedant: true,
                suivant: true,
                id: 6
            },
            //Outil 5
            {
                nom: "Couleur",
                description: "<h1> Couleur </h1> Description du couleur",
                precedant: true,
                suivant: true,
                id: 7
            }
        ]
    },
    {
      nom: "Test 8",
      id: 8,
      description: "<h1> TEST 8 </h1>",
      precedant: true,
      suivant: true
    },
    {
      nom: "Test 9",
      id: 9,
      description: "<h1> TEST 9 </h1>",
      precedant: true,
      suivant: true
    },
    {
      nom: "Test 10",
      id: 10,
      description: "<h1> TEST 10 </h1>",
      precedant: true,
      suivant: true
    },
    {
      nom: "Test 11",
      id: 11,
      description: "<h1> TEST 11 </h1>",
      precedant: true,
      suivant: false
    },
];
