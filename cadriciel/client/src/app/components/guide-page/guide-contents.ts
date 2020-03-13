import { SubjectGuide } from '../guide-subject/subject-guide';

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
                              avec une pointe ronde. L'outil est également accessible en appuyant sur la touche 'c'.</p>
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
                              <p> Le pinceau est très similaire au crayon, mais offre une texture supplémentaire. L'outil est également
                              accessible en appuyant sur la touche 'w'. </p>
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
                                      on peut choisir la forme de notre rectangle en navigant avec la souris. L'outil est également
                                      accessible en appuyant sur la touche '1'. </p>
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
                              <p> Après avoir sélectionné l'outil, il suffit à l'utilisateur de "glisser-déposer"
                              vers la zone de dessin pour créer une ellipse. En maintenant le clic gauche enfoncé,
                              on peut choisir la forme de notre ellipse en navigant avec la souris. L'outil est également
                              accessible en appuyant sur la touche '2'. </p>
                              <img src="assets/elipse.gif" width="300" height="300">
                              <p> L'enfoncement de la touche SHIFT transforme l'ellipse en cours de création au
                              cercle le plus proche et vice-versa. </p>
                             <p> Les paramètres personalisables sont:
                                <li> Épaisseur du trait de coutour (en px) </li>
                                <li> Type de tracé </li>
                            </p>`,
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
                              effectue un double-clic. L'outil est également accessible en appuyant sur la touche 'l'. </p>
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
                              <li> Le code RGB </li> <li> L'opacité </li> </p>
                              <img src="assets/couleur1.png" width="300" height="300">
                              <img src="assets/couleur2.png" width="300" height="300">`,
                        previous: true,
                        next: true,
                        id: 9
                    },
                    // Sujet 10
                    {
                        name: 'Pipette',
                        description: `<h1> Pipette </h1>
                                      <hr>
                                      <p> L'outil pipette permet de récupérer une couleur déjà présente sur la surface de dessin en
                                      cliquant dessus. La couleur renvoyée est celle-ci du pixel se trouvant sous le pointeur de la souris.
                                      L'outil est également accessible en appuyant sur la touche 'i'. </p>
                                      <p> Si le clic effectué est un clic gauche, la couleur renvoyée sera assignée à la couleur
                                      principale. </p>
                                      <p> Si le clic effectué est un clic droit, la couleur renvoyée sera assignée à la couleur secondaire.
                                      </p>`,
                        previous: true,
                        next: true,
                        id: 10
                    },
                    // Sujet 11
                    {
                        name: 'Applicateur de Couleur',
                        description: `<h1> Applicateur de couleur </h1>
                                      <hr>
                                      <p> L'outil applicateur de couleur permet de changer la couleur d'un élément déjà dessiné en cliquant
                                      dessus. L'élément prendra alors la couleur (principale ou secondaire) actuellement en cours.
                                      L'outil est également accessible en appuyant sur la touche 'r' </p>
                                      <p> Si le clic effectué est un clic gauche, la couleur principale de l'élément sera modifié. </p>
                                      <p> Si le clic effectué est un clic droit, la couleur secondaire de l'élément sera modifié. </p>`
                                      ,
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
                              <p> </p>`,
                previous: true,
                next: true,
                id: 12
            },
            // Sujet 13
            {
                name: 'Efface',
                description: `<h1> Efface </h1>
                              <hr>
                              <p> </p>`,
                previous: true,
                next: true,
                id: 13
            },
            // Sujet 14
            {
                name: 'Grille',
                description: `<h1> Grille </h1>
                              <hr>
                              <p> Il est possible de faire apparaitre une grille sur l'ensemble de la surface de dessin. </p>`,
                previous: true,
                next: true,
                id: 14
            },
            // Sujet 15
            {
                name: 'Annuler-Refaire',
                description: `<h1> Annuler-Refaire </h1>
                              <hr>
                              <p> </p>`,
                previous: true,
                next: true,
                id: 15
            }
        ]
    },
    {
        name: 'Gestion de Dessin',
        description: '',
        previous: false,
        next: false,
        openCategory: false,
        subSubjects: [
            {
                name: 'Sauvegarde',
                description: `<h1> Sauvegarde </h1>
                              <hr>
                              <p> Il est possible de sauvegarder le dessin dans la galerie via l'option "Sauvegarder le dessin" ou
                              encore avec le raccourci CTRL+S. Un menu de sauvagerde s'ouvrira alors. Pour être sauvegarder, le dessin
                              doit avoir un nom. Afin de pouvoir facilement retrouver le dessin dans la galerie, il est possible d'y
                              accrocher des étiquettes. L'utilisateur peut personalisé ses équittes ou utilisés les étiquettes suivantes:
                              <li> Portrait </li>
                              <li> Paysage </li>
                              <li> Pixel Art </li>
                              <li> Futuriste </li>
                              <li> Minimaliste </li>
                              </p>`,
                previous: true,
                next: true,
                id: 16
            },
            {
                name: 'Galerie',
                description: `<h1> Galerie </h1>
                              <hr>
                              <p> </p>`,
                previous: true,
                next: true,
                id: 17
            },
            {
                name: 'Exportation',
                description: `<h1> Exportation </h1>
                              <hr>
                              <p> Il est possible d'exporter son dessin localement via l'option "Exporter le dessin" ou encore avec le
                              raccourci CTRL+E.
                              Un menu d'exportation s'ouvrira alors, contenant le dessin. Le dessin peut-être nommée selon le
                              choix de l'utilisateur. Si aucun nom n'est spécifié, il portera celcui de "téléchargement" par défaut. <p>
                              <p> Trois formats d'exportation sont disponible:
                                    <li> JPEG </li>
                                    <li> PNG </li>
                                    <li> SVG </li></p>
                              </p>
                              <p> Il est également possible d'appliquer un filtre lors de l'exporation du dessin.
                              Cinq filtes sont disponibles:
                                    <li> Noir-et-Blanc </li>
                                    <li> Sépia </li>
                                    <li> Flou </li>
                                    <li> Tache </li>
                                    <li> Tremblant </li></p>
                              </p>`,
                previous: true,
                next: false,
                id: 18
            },
        ]
      }
];
