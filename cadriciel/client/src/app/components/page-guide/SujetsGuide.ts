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
                              <p> Le crayon est l'outil de traçage de base permettant de dessiner de simples traits
                              avec une pointe ronde. </p>
                              <img src="assets/crayon.gif" width="300" height="300">
                              <p> Les paramètres personalisables sont:
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
                              <p> Le pinceau est très similaire au crayon, mais offre une texture supplémentaire.</p>
                              <img src="assets/pinceau.gif" width="300" height="300">
                              <p> Les paramètres personalisables sont:
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
                              <img src="assets/rectangle.gif" width="300" height="300">
                              <p> L'enfoncement de la touche SHIFT transforme le rectangle en cours de création au carré le plus proche et
                              vice-versa. </p>
                              <p> Les paramètres personalisables sont:
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
                precedant: true,
                suivant: true,
                id: 5
            },
            // Index 6 - Outil 5
            {
                nom: 'Couleur',
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
                precedant: true,
                suivant: false,
                id: 6
            },
        ]
    },
];
