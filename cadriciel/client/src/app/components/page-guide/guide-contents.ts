import { SubjectGuide } from '../guide-sujet/subject-guide';

export const GUIDE_CONTENTS: SubjectGuide[] = [
    // Sujet 1
    {
      name: 'Bienvenue',
      id: 1,
      description: `<h1>Bienvenue à PolyDessin! </h1>
                    <hr>
                    <p> PolyDessin est un projet de 2ème année du génie logiciel à Polytechnique Montréal,
                    et consiste en une application web de dessin vectoriel. </p>
                    <p> Vous vous trouvez présentement dans le guide d'utilisation.
                    Celui-ci décrit et explique les différents outils implémentés.</p>
                    <img src="assets/poly.png">`,
      previous: false,
      next: true
    },
    // Catégorie 1 : Outils
    {
        name: 'Outils',
        description: '',
        previous: false,
        next: false,
        openCategory: false,
        subSubjects: [
            // Catégorie 2 : Outils de Traçages
            {
                name: 'Traçages',
                description: '',
                previous: false,
                next: false,
                openCategory: false,
                subSubjects: [
                    // Sujet 2
                    {
                        name: 'Crayon',
                        description: `<h1> Crayon </h1>
                              <hr>
                              <p> Le crayon est l'outil de traçage de base permettant de dessiner de simples traits
                              avec une pointe ronde. </p>
                              <img src="assets/crayon.gif" width="300" height="300">
                              <p> Les paramètres personalisables sont:
                              <li> Épaisseur du trait (en px) </li> </p>`,
                        previous: true,
                        next: true,
                        id: 2
                    },
                    // Sujet 3
                    {
                        name: 'Pinceau',
                        description: `<h1> Pinceau </h1>
                              <hr>
                              <p> Le pinceau est très similaire au crayon, mais offre une texture supplémentaire.</p>
                              <img src="assets/pinceau.gif" width="300" height="300">
                              <p> Les paramètres personalisables sont:
                              <li> Épaisseur du trait (en px) </li> <li> Texture du trait </li> </p>`,
                        previous: true,
                        next: true,
                        id: 3
                    },
                    // Sujet 4
                    {
                        name: 'Aérosol',
                        description: `<h1> Aérosol </h1>
                                      <hr>
                                      <p> <p>`,
                        previous: true,
                        next: true,
                        id: 4
                    },
                ]
            },
            // Catégorie 3 : Outils de Formes
            {
                name: 'Formes',
                description: '',
                previous: false,
                next: false,
                openCategory: false,
                subSubjects: [
                    {
                        // Sujet 5
                        name: 'Rectangle',
                        description: `<h1> Rectangle </h1>
                                      <hr>
                                      <p> Après avoir sélectionné l'outil, il suffit à l'utilisateur de "glisser-déposer"
                                      vers la zone de dessin pour créer un rectangle. En maintenant le clic gauche enfoncé,
                                      on peut choisir la forme de notre rectangle en navigant avec la souris. </p>
                                      <img src="assets/rectangle.gif" width="300" height="300">
                                      <p> L'enfoncement de la touche SHIFT transforme le rectangle en cours de création au 
                                      carré le plus proche et vice-versa. </p>
                                      <p> Les paramètres personalisables sont:
                                      <li> Épaisseur du trait de coutour (en px) </li> <li> Type de tracé </li> </p>`,
                        previous: true,
                        next: true,
                        id: 5
                    },
                    // Sujet 6
                    {
                        name: 'Ellipse',
                        description: `<h1> Ellipse </h1>
                              <hr>
                              <p> <p>`,
                        previous: true,
                        next: true,
                        id: 6
                    },
                    // Sujet 7
                    {
                        name: 'Polygone',
                        description: `<h1> Polygone </h1>
                              <hr>
                              <p> <p>`,
                        previous: true,
                        next: true,
                        id: 7
                    },
                    // Sujet 8
                    {
                        name: 'Ligne',
                        description: `<h1> Ligne </h1>
                              <hr>
                              <p> L'outil ligne permet de tracer une ou plusieurs segments d'une ligne. Il suffit, après avoir
                              sélectionné l'outil, de choisir le début de la ligne avec un clic quelque part sur la zone de dessin. Ensuite,
                              chaque nouveau clic fermera le segment en cours pour en débuter un nouveau. Pour terminer la ligne, on
                              effectue un double-clic. </p>
                              <img src="assets/ligne.gif" width="300" height="300">
                              <p> En enfonçant la touche SHIFT, le segment en cours s'aligne avec l'axe des X par rapport à un angle de
                              45 degrés. Il est aussi possible d'annuler la ligne sans son entièreté avec la touche ESPACE. Pour supprimer
                              uniquement le dernier segment (sauf le premier), appuyez sur BACKSPACE.</p>
                              <p> Les paramètres personalisables sont:
                              <li> Épaisseur du trait (en px) </li> <li> Type de jonction </li>
                              <li> Diamètre des jonctions </li></p>`,
                        previous: true,
                        next: true,
                        id: 8
                    },
                ]
            },
            // Catégorie 4 : Outils de Couleurs
            {
                name: 'Couleurs',
                description: '',
                previous: false,
                next: false,
                openCategory: false,
                subSubjects: [
                    // Sujet 9
                    {
                        name: 'Couleur',
                        description: `<h1> Couleur </h1>
                              <hr>
                              <p> L'outil couleur est un paramètre partagé entre tous les outils, il est d'ailleurs disponible dans le
                              panneau paramètre de chacun d'entre eux. Celui-ci offre deux couleurs configurable: la couleur "principale"
                              et la couleur "secondaire" qui sont interversible. </p>
                              <p> Pour choisir une couleur, l'utilisateur peut soit se déplacer sur une palette de couleur ou bien
                              directement marquer des valeurs RGB en hexadécimal de la couleur qu'il souhaite. </p>
                              <p> L'outil se rappelle aussi des 10 dernières couleurs choisis par l'utilisateur. En effectuant un clic droit
                              , l'utilisateur peut changer sa couleur principale et avec un clic gauche, sa couleur secondaire.</p>
                              <p> Les paramètres personalisables sont:
                              <li> Le code RGB </li> <li> L'opacité </li> </p>`,
                        previous: true,
                        next: true,
                        id: 9
                    },
                    // Sujet 10
                    {
                        name: 'Pipette',
                        description: `<h1> Pipette </h1>
                                      <hr>
                                      <p> <p>`,
                        previous: true,
                        next: true,
                        id: 10
                    },
                    // Sujet 11
                    {
                        name: 'Applicateur de Couleur',
                        description: `<h1> Applicateur de couleur </h1>
                                      <hr>
                                      <p> <p>`,
                        previous: true,
                        next: true,
                        id: 11
                    },
                ]
            },
            // Sujet 12
            {
                name: 'Selection',
                description: `<h1> Selection </h1>
                              <hr>
                              <p> <p>`,
                previous: true,
                next: true,
                id: 12
            },
            // Sujet 13
            {
                name: 'Efface',
                description: `<h1> Efface </h1>
                              <hr>
                              <p> <p>`,
                previous: true,
                next: false,
                id: 13
            },
        ]
    },
];
