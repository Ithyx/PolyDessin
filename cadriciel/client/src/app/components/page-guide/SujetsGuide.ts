import { GuideSujet } from '../guide-sujet/guide-sujet';

export const CONTENU_GUIDE: GuideSujet[] = [
    // Index 0 - Sujet 1
    {
      nom: 'Bienvenue',
      id: 1,
      description: `<h1>Bienvenue à PolyDessin! </h1>
                    <hr>
                    <p> PolyDessin est un projet de 2ème année du génie logiciel à Polytechnique Montréal,
                    et consiste en une application web de dessin vectoriel. </p>
                    <p> Vous vous trouvez présentement dans le guide d'utilisation.
                    Celui-ci décrit et explique les différents outils implémentés.</p>
                    <img src="assets/poly.png">`,
      precedant: false,
      suivant: true
    },
    // Index 1 - Catégorie 1
    {
        nom: 'Outils',
        description: '',
        precedant: false,
        suivant: false,
        categorieOuverte: false,
        sousSujets: [
            // Index 2 - Outil 1
            {
                nom: 'Crayon',
                description: `<h1> Crayon </h1>
                              <hr>
                              <p> Le crayon est l'outil de traçage de base permettant de dessiner de simple trait avec une pointe roude.</p>
                              <p color="red"> insérer gif utilisation crayon ici </p>
                              <p> Les paramètres personalisable sont:
                              <li> Épaisseur du trait (en px) </li> </p>`,
                precedant: true,
                suivant: true,
                id: 2
            },
            // Index 3 - Outil 2
            {
                nom: 'Pinceau',
                description: `<h1> Pinceau </h1>
                              <hr>
                              <p> Le pinceau est très similaire au crayon mais offre une texture supplémentaire.</p>
                              <p color="red"> insérer gif utilisation pinceau ici </p>
                              <p> Les paramètres personalisable sont:
                              <li> Épaisseur du trait (en px) </li> <li> Texture du trait </li> </p>`,
                precedant: true,
                suivant: true,
                id: 3
            },
            // Index 4 - Outil 3
            {
                nom: 'Rectangle',
                description: `<h1> Rectangle </h1>
                              <hr>
                              <p> Après avoir sélectionné l'outil, il suffit à l'utilisateur de "glisser-déposer" vers la zone de dessin
                              pour créer un rectangle. En maintenant le clic gauche enfoncé, on peut choisir la forme de notre rectangle
                              en navigant avec la souris. </p>
                              <p color="red"> insérer gif utilisation rectangle ici </p>
                              <p> L'enfoncement de la touche SHIFT transforme le rectangle en cours de création au carré le plus proche et
                              vice-versa. </p>
                              <p> Les paramètres personalisable sont:
                              <li> Épaisseur du trait de coutour (en px) </li> <li> Type de tracé </li> </p>`,
                precedant: true,
                suivant: true,
                id: 4
            },
            // Index 5 - Outil 4
            {
                nom: 'Ligne',
                description: `<h1> Ligne </h1>
                              <hr>
                              <p> Description de la ligne </p>`,
                precedant: true,
                suivant: true,
                id: 5
            },
            // Index 6 - Outil 5
            {
                nom: 'Couleur',
                description: `<h1> Couleur </h1>
                              <hr>
                              <p> L'outil couleur est un paramètre partagé entre tous les outils. Celui-ci offre deux couleurs configurable
                              la couleur "principale" et la couleur "secondaire" interversible. </p>`,
                precedant: true,
                suivant: false,
                id: 6
            },
        ]
    },
];
